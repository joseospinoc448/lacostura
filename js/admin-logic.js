document.addEventListener("DOMContentLoaded", () => {
	const CLAVE_CORRECTA = "Jc9263448!"; // Define aquí tu contraseña de ingreso

	// 1. CONTROL DE ACCESO (LOGIN)
	window.verificarAcceso = () => {
		const inputPass = document.getElementById("admin-pass");
		if (!inputPass) return;

		const pass = inputPass.value;
		if (pass === CLAVE_CORRECTA) {
			// Intercambio limpio de pantallas
			document.getElementById("admin-login").classList.add("hidden");
			document.getElementById("admin-panel").classList.remove("hidden");

			// Inicializar las funciones operativas sólo tras ingresar exitosamente
			inicializarEventosPanel();
		} else {
			alert("Clave incorrecta");
		}
	};

	// Escuchar la tecla Enter en el campo de contraseña
	const adminPassInput = document.getElementById("admin-pass");
	if (adminPassInput) {
		adminPassInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				window.verificarAcceso();
			}
		});
	}

	// Salir del panel administrativo y resetear estado
	window.cerrarSesion = () => {
		location.reload();
	};

	// 2. GESTIÓN DE LA TABLA DE PEDIDOS Y ARREGLOS
	window.agregarFila = () => {
		const tbody = document.querySelector("#tabla-pedidos tbody");
		if (!tbody) return;

		const tr = document.createElement("tr");
		tr.innerHTML = `
            <td><input type="number" class="c-cant" value="1"></td>
            <td><input type="text" class="c-desc" placeholder="Arreglo de prenda..."></td>
            <td><input type="number" class="c-unit" value="0"></td>
            <td><input type="number" class="c-total" value="0" readonly></td>
        `;
		tbody.appendChild(tr);
		vincularCalculos();
	};

	function vincularCalculos() {
		document
			.querySelectorAll(".c-cant, .c-unit, #abono-val")
			.forEach((input) => {
				input.oninput = recalcular;
			});
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

		const displayTotal = document.getElementById("display-total");
		const displaySaldo = document.getElementById("display-saldo");

		if (displayTotal) displayTotal.innerText = totalGeneral.toLocaleString();
		if (displaySaldo)
			displaySaldo.innerText = (totalGeneral - abono).toLocaleString();
	}

	// 3. LOGICA DE CONTROL DE ALERTAS VISUALES POR FECHA DE ENTREGA
	function calcularAlertaFecha() {
		const inputFecha = document.getElementById("fecha-entrega");
		if (!inputFecha || !inputFecha.value) return;

		// Descomponer la fecha manualmente para evitar desfases de zona horaria
		const partes = inputFecha.value.split("-");
		const anio = parseInt(partes[0], 10);
		const mes = parseInt(partes[1], 10) - 1;
		const dia = parseInt(partes[2], 10);

		const fechaEntrega = new Date(anio, mes, dia);

		// Obtener la fecha de hoy a las 00:00:00
		const fechaActual = new Date();
		fechaActual.setHours(0, 0, 0, 0);

		// Calcular la diferencia en días calendario neta
		const diferenciaMilisegundos = fechaEntrega - fechaActual;
		const diferenciaDias = Math.round(
			diferenciaMilisegundos / (1000 * 60 * 60 * 24),
		);

		// Limpiar clases previas de alerta en pantalla
		inputFecha.classList.remove(
			"alerta-verde",
			"alerta-amarillo",
			"alerta-rojo",
		);

		// Evaluar rangos de tiempo establecidos
		if (diferenciaDias >= 2) {
			inputFecha.classList.add("alerta-verde");
		} else if (diferenciaDias === 1) {
			inputFecha.classList.add("alerta-amarillo");
		} else {
			inputFecha.classList.add("alerta-rojo");
		}
	}

	function inicializarEventosPanel() {
		const fechaEntregaInput = document.getElementById("fecha-entrega");
		if (fechaEntregaInput) {
			fechaEntregaInput.addEventListener("change", calcularAlertaFecha);
			fechaEntregaInput.addEventListener("input", calcularAlertaFecha);
		}
		// Cargar primera fila de trabajo por defecto
		agregarFila();

		// Inicializar el buscador (estará vacío por defecto)
		window.buscarOrdenes();
	}

	// ========================================================
	// LOGICA DE HISTORIAL: GUARDADO Y BÚSQUEDA OPTIMIZADA
	// ========================================================

	function guardarOrdenEnHistorial() {
		const ordenNo = (document.getElementById("orden-no").value || "S/N").trim();
		const clienteNom = document.getElementById("cliente-nom").value.trim();

		if (!clienteNom) return;

		const fechaReg = document.getElementById("fecha-auto").value || "";
		const clienteDir = document.getElementById("cliente-dir").value || "";
		const clienteCel = document.getElementById("cliente-cel").value || "";
		const fechaEntrega = document.getElementById("fecha-entrega").value || "";
		const abonoVal =
			parseFloat(document.getElementById("abono-val").value) || 0;

		let totalCalculado = 0;
		const prendas = [];
		document.querySelectorAll("#tabla-pedidos tbody tr").forEach((tr) => {
			const cant = parseFloat(tr.querySelector(".c-cant").value) || 0;
			const desc = tr.querySelector(".c-desc").value.trim();
			const unit = parseFloat(tr.querySelector(".c-unit").value) || 0;
			const subtotal = cant * unit;

			if (desc) {
				prendas.push({
					cant: cant.toString(),
					desc,
					unit: unit.toString(),
					total: subtotal.toString(),
				});
				totalCalculado += subtotal;
			}
		});

		const saldoCalculado = totalCalculado - abonoVal;

		const nuevaOrden = {
			id: Date.now(),
			ordenNo,
			fechaReg,
			clienteNom,
			clienteDir,
			clienteCel,
			fechaEntrega,
			abonoVal: abonoVal.toString(),
			totalVal: totalCalculado.toLocaleString(),
			saldoVal: saldoCalculado.toLocaleString(),
			prendas,
		};

		let historial = JSON.parse(localStorage.getItem("historial_costura")) || [];

		// Eliminamos estrictamente cualquier duplicado previo de este mismo número de orden
		historial = historial.filter(
			(item) => item.ordenNo.toLowerCase() !== ordenNo.toLowerCase(),
		);

		// Insertamos la orden fresca al inicio
		historial.unshift(nuevaOrden);

		localStorage.setItem("historial_costura", JSON.stringify(historial));
	}

	window.buscarOrdenes = () => {
		const query = document
			.getElementById("buscar-cliente")
			.value.toLowerCase()
			.trim();
		const contenedorResultados = document.getElementById("resultados-busqueda");
		if (!contenedorResultados) return;

		contenedorResultados.innerHTML = "";

		// MEJORA: Si la caja de búsqueda está vacía, no muestra nada (así evitamos ver registros viejos por error)
		if (query === "") {
			contenedorResultados.innerHTML = `<p style="font-size: 12px; color: #64748b; padding: 5px;">Escribe el nombre de un cliente para consultar su historial.</p>`;
			return;
		}

		const historial =
			JSON.parse(localStorage.getItem("historial_costura")) || [];

		const filtrados = historial.filter((orden) =>
			orden.clienteNom.toLowerCase().includes(query),
		);

		if (filtrados.length === 0) {
			contenedorResultados.innerHTML = `<p style="font-size: 12px; color: #64748b; padding: 5px;">No se encontraron órdenes para este cliente.</p>`;
			return;
		}

		filtrados.forEach((orden) => {
			const card = document.createElement("div");
			card.className = "search-item-card";
			card.innerHTML = `
                <div class="search-item-info">
                    <p><span class="order-tag">Orden No. ${orden.ordenNo}</span> — <span class="client-tag">${orden.clienteNom}</span></p>
                    <p style="color: #475569;"><i class="fas fa-tshirt"></i> ${orden.prendas.length} artículo(s)</p>
                </div>
                <div class="search-item-status">
                    <span class="balance-tag">Saldo: $${orden.saldoVal}</span>
                    <span class="date-tag">Entrega: ${orden.fechaEntrega}</span>
                </div>
            `;
			card.onclick = () => cargarOrdenEnFormulario(orden.id);
			contenedorResultados.appendChild(card);
		});
	};

	function cargarOrdenEnFormulario(id) {
		const historial =
			JSON.parse(localStorage.getItem("historial_costura")) || [];
		const orden = historial.find((item) => item.id === id);
		if (!orden) return;

		document.getElementById("orden-no").value = orden.ordenNo;
		document.getElementById("fecha-auto").value = orden.fechaReg;
		document.getElementById("cliente-nom").value = orden.clienteNom;
		document.getElementById("cliente-dir").value = orden.clienteDir;
		document.getElementById("cliente-cel").value = orden.clienteCel;
		document.getElementById("fecha-entrega").value = orden.fechaEntrega;
		document.getElementById("abono-val").value = orden.abonoVal;

		const tbody = document.querySelector("#tabla-pedidos tbody");
		if (tbody) {
			tbody.innerHTML = "";
			if (orden.prendas.length === 0) {
				window.agregarFila();
			} else {
				orden.prendas.forEach((prenda) => {
					const tr = document.createElement("tr");
					tr.innerHTML = `
                        <td><input type="number" class="c-cant" value="${prenda.cant}"></td>
                        <td><input type="text" class="c-desc" value="${prenda.desc}"></td>
                        <td><input type="number" class="c-unit" value="${prenda.unit}"></td>
                        <td><input type="number" class="c-total" value="${prenda.total}" readonly></td>
                    `;
					tbody.appendChild(tr);
				});
			}
		}

		vincularCalculos();
		recalcular();
		calcularAlertaFecha();

		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// 4. GENERAR E IMPRIMIR RECIBO
	window.generarEImprimir = () => {
		guardarOrdenEnHistorial(); // Guarda la orden actual en el historial inmediatamente
		window.print(); // Abre la impresión

		// Limpiamos el buscador para la siguiente transacción
		document.getElementById("buscar-cliente").value = "";
		window.buscarOrdenes();

		// Reseteamos el formulario principal para quedar limpios para el siguiente cliente
		document.getElementById("form-ticket").reset();
		const tbody = document.querySelector("#tabla-pedidos tbody");
		if (tbody) tbody.innerHTML = "";
		window.agregarFila();
		recalcular();

		// Auto-incremento del número correlativo para la próxima orden
		const historialActual =
			JSON.parse(localStorage.getItem("historial_costura")) || [];
		const proximoNumero = historialActual.length + 1;
		document.getElementById("orden-no").value = proximoNumero
			.toString()
			.padStart(3, "0");
	};
});
