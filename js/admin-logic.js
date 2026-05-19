document.addEventListener("DOMContentLoaded", () => {
	const CLAVE_CORRECTA = "1234"; // Define aquí tu contraseña de ingreso

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
	}

	window.generarEImprimir = () => {
		window.print();
	};
});
