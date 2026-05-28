document.addEventListener("DOMContentLoaded", () => {
	const CLAVE_CORRECTA = "Jc9263448!";

	// --- VISIBILIDAD CONTRASEÑA ---
	window.togglePasswordVisibility = () => {
		const inputPass = document.getElementById("admin-pass");
		const icon = document.getElementById("togglePassword");
		if (inputPass.type === "password") {
			inputPass.type = "text";
			icon.classList.remove("fa-eye");
			icon.classList.add("fa-eye-slash");
		} else {
			inputPass.type = "password";
			icon.classList.remove("fa-eye-slash");
			icon.classList.add("fa-eye");
		}
	};

	// --- ACCESO ---
	window.verificarAcceso = () => {
		if (document.getElementById("admin-pass").value === CLAVE_CORRECTA) {
			document.getElementById("admin-login").classList.add("hidden");
			document.getElementById("admin-panel").classList.remove("hidden");
			inicializarEventosPanel();
		} else {
			alert("Clave incorrecta");
		}
	};

	document.getElementById("admin-pass")?.addEventListener("keypress", (e) => {
		if (e.key === "Enter") window.verificarAcceso();
	});

	window.cerrarSesion = () => location.reload();

	// --- RESPALDO (BACKUP) ---
	window.descargarBackup = () => {
		const historial = localStorage.getItem("historial_costura");
		if (!historial) {
			alert("No hay datos.");
			return;
		}
		const blob = new Blob([historial], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `backup_la_costura_${new Date().toISOString().split("T")[0]}.json`;
		a.click();
	};

	// --- LÓGICA DE PEDIDOS ---
	window.agregarFila = () => {
		const tbody = document.querySelector("#tabla-pedidos tbody");
		const tr = document.createElement("tr");
		tr.innerHTML = `<td><input type="number" class="c-cant" value="1"></td><td><input type="text" class="c-desc" placeholder="Arreglo..."></td><td><input type="number" class="c-unit" value="0"></td><td><input type="number" class="c-total" value="0" readonly></td>`;
		tbody.appendChild(tr);
		vincularCalculos();
	};

	function vincularCalculos() {
		document
			.querySelectorAll(".c-cant, .c-unit, #abono-val")
			.forEach((input) => (input.oninput = recalcular));
	}

	function recalcular() {
		let totalGeneral = 0;
		document.querySelectorAll("#tabla-pedidos tbody tr").forEach((tr) => {
			const cant = parseFloat(tr.querySelector(".c-cant").value) || 0;
			const unit = parseFloat(tr.querySelector(".c-unit").value) || 0;
			const sub = cant * unit;
			tr.querySelector(".c-total").value = sub;
			totalGeneral += sub;
		});
		const abono = parseFloat(document.getElementById("abono-val").value) || 0;
		document.getElementById("display-total").innerText =
			totalGeneral.toLocaleString();
		document.getElementById("display-saldo").innerText = (
			totalGeneral - abono
		).toLocaleString();
	}

	function calcularAlertaFecha() {
		const inputFecha = document.getElementById("fecha-entrega");
		if (!inputFecha || !inputFecha.value) return;
		const partes = inputFecha.value.split("-");
		const fechaEntrega = new Date(partes[0], partes[1] - 1, partes[2]);
		const fechaActual = new Date();
		fechaActual.setHours(0, 0, 0, 0);
		const dif = Math.round(
			(fechaEntrega - fechaActual) / (1000 * 60 * 60 * 24),
		);

		inputFecha.classList.remove(
			"alerta-verde",
			"alerta-amarillo",
			"alerta-rojo",
		);
		if (dif >= 2) inputFecha.classList.add("alerta-verde");
		else if (dif === 1) inputFecha.classList.add("alerta-amarillo");
		else if (dif <= 0) inputFecha.classList.add("alerta-rojo");
	}

	function inicializarEventosPanel() {
		document
			.getElementById("fecha-entrega")
			.addEventListener("input", calcularAlertaFecha);
		agregarFila();
		window.buscarOrdenes();
		actualizarConsecutivo();
		// Asignar fecha actual por defecto si está vacío
		if (!document.getElementById("fecha-auto").value) {
			document.getElementById("fecha-auto").valueAsDate = new Date();
		}
	}

	function actualizarConsecutivo() {
		const historial =
			JSON.parse(localStorage.getItem("historial_costura")) || [];
		let maxNum = 0;
		historial.forEach((orden) => {
			const num = parseInt(orden.ordenNo, 10);
			if (!isNaN(num) && num > maxNum) maxNum = num;
		});
		document.getElementById("orden-no").value = (maxNum + 1)
			.toString()
			.padStart(4, "0");
	}

	function guardarOrdenEnHistorial() {
		const ordenNo = document.getElementById("orden-no").value.trim();
		const clienteNom = document.getElementById("cliente-nom").value.trim();
		if (!clienteNom) return false;

		const prendas = [];
		document.querySelectorAll("#tabla-pedidos tbody tr").forEach((tr) => {
			const desc = tr.querySelector(".c-desc").value.trim();
			if (desc)
				prendas.push({
					cant: tr.querySelector(".c-cant").value,
					desc,
					unit: tr.querySelector(".c-unit").value,
					total: tr.querySelector(".c-total").value,
				});
		});

		const nuevaOrden = {
			id: Date.now(),
			ordenNo,
			clienteNom,
			fechaReg: document.getElementById("fecha-auto").value, // Captura de fecha corregida
			clienteDir: document.getElementById("cliente-dir").value,
			clienteCel: document.getElementById("cliente-cel").value,
			fechaEntrega: document.getElementById("fecha-entrega").value,
			abonoVal: document.getElementById("abono-val").value,
			saldoVal: document.getElementById("display-saldo").innerText,
			prendas,
		};

		let historial = JSON.parse(localStorage.getItem("historial_costura")) || [];
		historial = historial.filter((o) => o.ordenNo !== ordenNo);
		historial.unshift(nuevaOrden);
		localStorage.setItem("historial_costura", JSON.stringify(historial));
		return true;
	}

	window.generarEImprimir = () => {
		if (guardarOrdenEnHistorial()) {
			setTimeout(() => {
				window.print();
				document.getElementById("form-ticket").reset();
				document.querySelector("#tabla-pedidos tbody").innerHTML = "";
				agregarFila();
				recalcular();
				actualizarConsecutivo();
				document.getElementById("fecha-auto").valueAsDate = new Date(); // Reset fecha
				window.buscarOrdenes();
			}, 500);
		}
	};

	window.buscarOrdenes = () => {
		const query = document
			.getElementById("buscar-cliente")
			.value.toLowerCase()
			.trim();
		const contenedor = document.getElementById("resultados-busqueda");
		contenedor.innerHTML = "";
		if (query === "") return;
		const historial =
			JSON.parse(localStorage.getItem("historial_costura")) || [];
		const filtrados = historial.filter((orden) =>
			orden.clienteNom.toLowerCase().includes(query),
		);

		const vistos = new Set();
		filtrados.forEach((orden) => {
			if (vistos.has(orden.ordenNo)) return;
			vistos.add(orden.ordenNo);
			const card = document.createElement("div");
			card.className = "search-item-card";
			card.innerHTML = `<div class="search-item-info"><p>Orden No. ${orden.ordenNo} — <b>${orden.clienteNom}</b></p></div><div class="search-item-status">Saldo: $${orden.saldoVal}</div>`;
			card.onclick = () => cargarOrden(orden.id);
			contenedor.appendChild(card);
		});
	};

	function cargarOrden(id) {
		const historial =
			JSON.parse(localStorage.getItem("historial_costura")) || [];
		const orden = historial.find((item) => item.id === id);
		if (!orden) return;

		document.getElementById("orden-no").value = orden.ordenNo;
		document.getElementById("cliente-nom").value = orden.clienteNom;
		document.getElementById("cliente-dir").value = orden.clienteDir;
		document.getElementById("cliente-cel").value = orden.clienteCel;
		document.getElementById("fecha-auto").value = orden.fechaReg; // Carga de fecha corregida
		document.getElementById("fecha-entrega").value = orden.fechaEntrega;
		document.getElementById("abono-val").value = orden.abonoVal;

		const tbody = document.querySelector("#tabla-pedidos tbody");
		tbody.innerHTML = "";
		orden.prendas.forEach((p) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `<td><input type="number" class="c-cant" value="${p.cant}"></td><td><input type="text" class="c-desc" value="${p.desc}"></td><td><input type="number" class="c-unit" value="${p.unit}"></td><td><input type="number" class="c-total" value="${p.total}" readonly></td>`;
			tbody.appendChild(tr);
		});
		vincularCalculos();
		recalcular();
		calcularAlertaFecha();
	}
});
