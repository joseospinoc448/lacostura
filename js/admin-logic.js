document.addEventListener("DOMContentLoaded", () => {
	const CLAVE_CORRECTA = "1234"; // Cambia por tu clave

	window.verificarAcceso = () => {
		const pass = document.getElementById("admin-pass").value;
		if (pass === CLAVE_CORRECTA) {
			document.getElementById("admin-login").classList.add("hidden");
			document.getElementById("admin-panel").classList.remove("hidden");
		} else {
			alert("Clave incorrecta");
		}
	};

	// Acceso con tecla Enter
	const adminPassInput = document.getElementById("admin-pass");
	if (adminPassInput) {
		adminPassInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				window.verificarAcceso();
			}
		});
	}

	window.cerrarSesion = () => {
		location.reload();
	};

	window.agregarFila = () => {
		const tbody = document.querySelector("#tabla-pedidos tbody");
		const tr = document.createElement("tr");
		tr.innerHTML = `
            <td><input type="number" class="c-cant" value="1"></td>
            <td><input type="text" class="c-desc" placeholder="Arreglo..."></td>
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
		document.getElementById("display-total").innerText =
			totalGeneral.toLocaleString();
		document.getElementById("display-saldo").innerText = (
			totalGeneral - abono
		).toLocaleString();
	}

	window.generarEImprimir = () => {
		window.print();
	};

	// Inicializar con una fila
	agregarFila();
});
