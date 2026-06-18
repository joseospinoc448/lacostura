// ==========================================================================
// 0. BASE DE DATOS LOCAL DE PRECIOS PARA AUTOCOMPLETADO AUTOMÁTICO
// ==========================================================================
const PRECIOS_PROCEDIMIENTOS = {
	Descaderados: 17000,
	"Armar con cierre -cojines": 17000,
	"Bolso cambios de cierre": 19000,
	"Blusas cambio de cierre": 14000,
	"Encauchado completo-sabana": 21000,
	"Encauchado completo-manta": 45000,
	"Encauchado completo-cojín": 25000,
	"Encauchaudo cabecero-sabana": 19000,
	"Encauchado cabecero-manta": 35000,
	"Encauchado cabecero-cojín": 20000,
	"Encauchaudo Esquina-sabana": 17000,
	"Encauchado Esquina-manta": 25000,
	"Encauchado Esquina-cojín": 15000,
	"Cambio caucho pantalon": 14000,
	"Camisa-lavanderia": 17000,
	"Cambio caucho falda": 14000,
	"Cambio caucho short": 12000,
	"Cambio caucho camisa": 12000,
	"Cambio caucho manga": 12000,
	"Cambio caucho faja": 15000,
	"cambio boton  Jeans por bolsillo": 2000,
	"Largo corriente": 11000,
	"blusas hacer pinzas": 12000,
	"Largo original": 14000,
	"cambio de gafetes": 18000,
	"reducion total faja": 35000,
	"reduccion tanga  de baño": 15000,
	"reducion talla faja costados piernas": 25000,
	"reducion talla faja costados": 15000,
	"largo faja con encaje siliconado": 18000,
	"Largo a  mano": 14000,
	"costura mas filete": 5000,
	"costura sencilla": 2000,
	collarin: 12000,
	"bajar dobladillo con sesgo": 12000,
	entubar: 14000,
	"Chaqueta cambio de cierre": 19000,
	"Largo y entubar": 18000,
	"Tallar lados": 14000,
	"Tallar tiro ": 14000,
	"Tallar cintura": 18000,
	"Teñidos general prenda": 19000,
	"Cintura y largo": 20000,
	"Cambio de  dos bolsillos": 24000,
	"Pantalon-lavanderia": 17000,
	"Cambio de un bolsillo": 12000,
	"Bajar talla total": 24000,
	"Tallado de hombros": 14000,
	"Tallado lado con manga": 15000,
	"Tallar lados": 14000,
	"Tallar Hombros y lados": 18000,
	"Largo Total camisas": 11000,
	"Largo de manga": 11000,
	"Largo manga con pieza": 14000,
	"Bajar talla total camisa o blusa": 24000,
	"Pantalon cambios cierre": 11000,
	"prenda en lino-lavanderia": 19000,
	"Voltear cuello camisa": 10000,
	"Voltear cuello con refuerzo camisa": 12000,
	"Vesti. 1a comunion sencillo mas lavanderia": 45000,
	"Vesti. 1a comunion con encaje mas lavanderia": 55000,
	"Vesti. 1a comunion sencillomas lavanderia y planchado": 60000,
	"Vesti. 1a comunion con encaje mas lavanderia y planchado": 70000,
	"Vest. 1a com con pedreria mas lavanderia": 60000,
	"Tendidos-lavanderia": 46000,
	"Vestido fiesta mas lavanderia": 39000,
	"vestido en lino mas lavanderia": 45000,
	"Jeans cambios de cierre": 14000,
	"Cambio cierre en cojines": 14000,
};

// Map auxiliar en minúsculas para garantizar búsquedas insensibles a mayúsculas/minúsculas
const PRECIOS_MINUSCULAS = {};
Object.keys(PRECIOS_PROCEDIMIENTOS).forEach((key) => {
	PRECIOS_MINUSCULAS[key.toLowerCase().trim()] = PRECIOS_PROCEDIMIENTOS[key];
});

// ==========================================================================
// FUNCION AUXILIAR: POBLAR DATALIST AUTOMÁTICAMENTE DESDE JAVASCRIPT
// ==========================================================================
function poblarDatalistProcedimientos() {
	let datalist = document.getElementById("procedimientos");

	// Si por algún motivo no existe el datalist en el HTML, lo creamos dinámicamente
	if (!datalist) {
		datalist = document.createElement("datalist");
		datalist.id = "procedimientos";
		document.body.appendChild(datalist);
	}

	// Limpiamos cualquier opción vieja para evitar duplicados
	datalist.innerHTML = "";

	// Inyectamos todos los servicios de nuestra base de datos local
	Object.keys(PRECIOS_PROCEDIMIENTOS).forEach((servicio) => {
		const option = document.createElement("option");
		option.value = servicio;
		datalist.appendChild(option);
	});
	console.log("Datalist de procedimientos cargado con éxito.");
}

// ==========================================================================
// 1. FUNCIONES GLOBALES (Accesibles desde el HTML / Ámbito Window)
// ==========================================================================

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

window.verificarAccAccess = () => {
	/* Alias de respaldo */ window.verificarAcceso();
};

window.verificarAcceso = () => {
	const CLAVE_CORRECTA = "Jc9263448!";
	const passInput = document.getElementById("admin-pass");
	if (passInput && passInput.value === CLAVE_CORRECTA) {
		document.getElementById("admin-login").classList.add("hidden");
		document.getElementById("admin-panel").classList.remove("hidden");
		inicializarEventosPanel();
	} else {
		alert("Clave incorrecta");
	}
};

window.cerrarSesion = () => location.reload();

window.descargarBackup = () => {
	const historial = localStorage.getItem("historial_costura");
	if (!historial) {
		alert("No hay datos para respaldar.");
		return;
	}
	const blob = new Blob([historial], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `backup_la_costura_${new Date().toISOString().split("T")[0]}.json`;
	a.click();
};

window.agregarFila = () => {
	const tbody = document.querySelector("#tabla-pedidos tbody");
	if (!tbody) return;
	const tr = document.createElement("tr");

	// Agregamos autocomplete="on" explícitamente para obligar al navegador a desplegar las opciones
	tr.innerHTML = `
        <td>
            <input type="number" class="c-cant" value="1">
            <span class="print-text-cell p-cant-txt">1</span>
        </td>
        <td>
            <input type="text" class="c-desc" list="procedimientos" autocomplete="on" placeholder="Arreglo o prenda...">
            <span class="print-text-cell p-desc-txt"></span>
        </td>
        <td>
            <input type="text" class="c-unit" value="0">
            <span class="print-text-cell p-unit-txt">0</span>
        </td>
        <td>
            <input type="text" class="c-total" value="0" readonly>
            <span class="print-text-cell p-total-txt">0</span>
        </td>
    `;
	tbody.appendChild(tr);
	vincularCalculos();
};

window.generarEImprimir = () => {
	console.log("Iniciando proceso de mapeo e impresión con puntos de miles...");

	// 1. Mapear datos de cabecera
	const ordenInp = document.getElementById("orden-no");
	if (ordenInp)
		document.getElementById("print-orden-txt").innerText = ordenInp.value;

	const fechaRegInp = document.getElementById("fecha-auto");
	if (fechaRegInp && fechaRegInp.value) {
		const p = fechaRegInp.value.split("-");
		document.getElementById("print-registro-txt").innerText =
			`${p[2]}/${p[1]}/${p[0]}`;
	}

	const fechaEntregaInp = document.getElementById("fecha-entrega");
	if (fechaEntregaInp && fechaEntregaInp.value) {
		const p = fechaEntregaInp.value.split("-");
		document.getElementById("print-entrega-txt").innerText =
			`${p[2]}/${p[1]}/${p[0]}`;
	} else {
		document.getElementById("print-entrega-txt").innerText = "PENDIENTE";
	}

	document.getElementById("print-cliente-txt").innerText =
		document.getElementById("cliente-nom").value || "---";
	document.getElementById("print-dir-txt").innerText =
		document.getElementById("cliente-dir").value || "---";
	document.getElementById("print-cel-txt").innerText =
		document.getElementById("cliente-cel").value || "---";

	// 2. Formatear abono con puntos en el ticket impreso
	const abonoVal = document.getElementById("abono-val").value || "0";
	document.getElementById("print-abono-txt").innerText = parseFloat(
		abonoVal.replace(/\./g, "") || 0,
	).toLocaleString("es-CO");

	// 3. Mapear y formatear dinámicamente cada celda de la tabla para la impresión física
	document.querySelectorAll("#tabla-pedidos tbody tr").forEach((tr) => {
		const cantVal = tr.querySelector(".c-cant").value || "0";
		const descVal = tr.querySelector(".c-desc").value || "---";

		const unitRaw = tr.querySelector(".c-unit").value || "0";
		const unitVal = parseFloat(unitRaw.replace(/\./g, "")) || 0;

		const totalRaw = tr.querySelector(".c-total").value || "0";
		const totalVal = parseFloat(totalRaw.replace(/\./g, "")) || 0;

		tr.querySelector(".p-cant-txt").innerText = cantVal;
		tr.querySelector(".p-desc-txt").innerText = descVal;
		tr.querySelector(".p-unit-txt").innerText = unitVal.toLocaleString("es-CO");
		tr.querySelector(".p-total-txt").innerText =
			totalVal.toLocaleString("es-CO");
	});

	if (guardarOrdenEnHistorial()) {
		setTimeout(() => {
			window.print();

			// Restablecer el formulario de forma segura
			const formTicket = document.getElementById("form-ticket");
			if (formTicket) formTicket.reset();

			const tbody = document.querySelector("#tabla-pedidos tbody");
			if (tbody) tbody.innerHTML = "";

			window.agregarFila();
			recalcular();
			actualizarConsecutivo();

			const fechaAuto = document.getElementById("fecha-auto");
			if (fechaAuto) fechaAuto.valueAsDate = new Date();

			const fEntrega = document.getElementById("fecha-entrega");
			if (fEntrega) fEntrega.className = "";

			window.buscarOrdenes();
			console.log("Proceso completado con éxito.");
		}, 400);
	} else {
		console.error("Error: Verifique el nombre del cliente.");
	}
};

// TRIPLE MOTOR DE BÚSQUEDA HISTÓRICA INTEGRADO CON COLORES DE ALERTA
window.buscarOrdenes = () => {
	const searchInput = document.getElementById("buscar-cliente");
	if (!searchInput) return;
	const query = searchInput.value.toLowerCase().trim();
	const contenedor = document.getElementById("resultados-busqueda");
	if (!contenedor) return;

	contenedor.innerHTML = "";
	if (query === "") return;

	const historial = JSON.parse(localStorage.getItem("historial_costura")) || [];

	const filtrados = historial.filter((orden) => {
		const porNombre = orden.clienteNom
			? orden.clienteNom.toLowerCase().includes(query)
			: false;
		const porOrden = orden.ordenNo
			? orden.ordenNo.toLowerCase().includes(query)
			: false;

		let porFecha = false;
		if (orden.fechaEntrega) {
			const fechaOriginal = orden.fechaEntrega.toLowerCase();
			const p = orden.fechaEntrega.split("-");
			const fechaLatina =
				p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}`.toLowerCase() : "";
			porFecha = fechaOriginal.includes(query) || fechaLatina.includes(query);
		}

		let porAlerta = false;
		if (orden.fechaEntrega) {
			const partes = orden.fechaEntrega.split("-");
			if (partes.length === 3) {
				const fEntrega = new Date(partes[0], partes[1] - 1, partes[2]);
				const fHoy = new Date();
				fHoy.setHours(0, 0, 0, 0);
				const dif = Math.round((fEntrega - fHoy) / (1000 * 60 * 60 * 24));

				let textoAlerta = "";
				if (dif >= 2) textoAlerta = "verde";
				else if (dif === 1) textoAlerta = "amarillo";
				else if (dif <= 0) textoAlerta = "rojo";

				porAlerta = textoAlerta.includes(query);
			}
		}

		return porNombre || porOrden || porFecha || porAlerta;
	});

	const vistas = new Set();
	filtrados.forEach((orden) => {
		if (vistas.has(orden.ordenNo)) return;
		vistas.add(orden.ordenNo);
		const card = document.createElement("div");
		card.className = "search-item-card";

		const saldoFormateado =
			orden.saldoVal && orden.saldoVal.includes(".")
				? orden.saldoVal
				: parseFloat(
						(orden.saldoVal || "").replace(/\D/g, "") || 0,
					).toLocaleString("es-CO");

		card.innerHTML = `
            <div class="search-item-info">
                <p>Orden No. ${orden.ordenNo} — <b>${orden.clienteNom || "Sin Nombre"}</b></p>
            </div>
            <div class="search-item-status">Saldo: $${saldoFormateado}</div>
        `;
		card.onclick = () => cargarOrden(orden.id);
		contenedor.appendChild(card);
	});
};

window.importarBackup = (event) => {
	const archivo = event.target.files[0];
	if (!archivo) return;

	const lector = new FileReader();
	lector.onload = function (e) {
		try {
			const datosImportados = JSON.parse(e.target.result);
			if (Array.isArray(datosImportados)) {
				localStorage.setItem(
					"historial_costura",
					JSON.stringify(datosImportados),
				);
				alert(
					"¡Base de datos importada con éxito! El historial se ha actualizado.",
				);
				window.location.reload();
			} else {
				alert("Error: El archivo seleccionado no tiene el formato correcto.");
			}
		} catch (error) {
			alert("Error al leer el archivo de copia de seguridad.");
			console.error(error);
		}
	};
	lector.readAsText(archivo);
};

// ==========================================================================
// 2. LÓGICA DE PROCESAMIENTO INTERNO Y CÁLCULOS
// ==========================================================================

function vincularCalculos() {
	// Usamos el evento 'input' combinado con validación de concordancia total para dar una respuesta inmediata
	document.querySelectorAll(".c-desc").forEach((inputDesc) => {
		inputDesc.oninput = function () {
			const fila = this.closest("tr");
			const inputUnit = fila.querySelector(".c-unit");
			const valorEscrito = this.value.trim().toLowerCase();

			// Solo asigna el precio si lo que está en la casilla es idéntico a una opción válida (ej. al seleccionarla)
			if (PRECIOS_MINUSCULAS[valorEscrito] !== undefined) {
				inputUnit.value =
					PRECIOS_MINUSCULAS[valorEscrito].toLocaleString("es-CO");
				recalcular();
			}
		};
	});

	document.querySelectorAll(".c-unit").forEach((input) => {
		input.oninput = function () {
			let valorLimpio = this.value.replace(/\D/g, "");
			this.value =
				valorLimpio !== ""
					? parseFloat(valorLimpio).toLocaleString("es-CO")
					: "0";
			recalcular();
		};
	});

	document.querySelectorAll(".c-cant, #abono-val").forEach((input) => {
		input.oninput = function () {
			if (this.id === "abono-val") {
				let valorLimpio = this.value.replace(/\D/g, "");
				this.value =
					valorLimpio !== ""
						? parseFloat(valorLimpio).toLocaleString("es-CO")
						: "0";
			}
			recalcular();
		};
	});
}

function recalcular() {
	let totalGeneral = 0;
	document.querySelectorAll("#tabla-pedidos tbody tr").forEach((tr) => {
		const cant = parseFloat(tr.querySelector(".c-cant").value) || 0;
		const unitRaw = tr.querySelector(".c-unit").value || "0";
		const unit = parseFloat(unitRaw.replace(/\./g, "")) || 0;

		const sub = cant * unit;
		tr.querySelector(".c-total").value = sub.toLocaleString("es-CO");
		totalGeneral += sub;
	});

	const abonoInput = document.getElementById("abono-val");
	const abono = abonoInput
		? parseFloat(abonoInput.value.replace(/\./g, "")) || 0
		: 0;

	const displayTotal = document.getElementById("display-total");
	const displaySaldo = document.getElementById("display-saldo");

	if (displayTotal)
		displayTotal.innerText = totalGeneral.toLocaleString("es-CO");
	if (displaySaldo)
		displaySaldo.innerText = (totalGeneral - abono).toLocaleString("es-CO");
}

function calcularAlertaFecha() {
	const inputFecha = document.getElementById("fecha-entrega");
	if (!inputFecha || !inputFecha.value) return;

	const partes = inputFecha.value.split("-");
	const fechaEntrega = new Date(partes[0], partes[1] - 1, partes[2]);
	const fechaActual = new Date();
	fechaActual.setHours(0, 0, 0, 0);

	const dif = Math.round((fechaEntrega - fechaActual) / (1000 * 60 * 60 * 24));

	inputFecha.className = ""; // Limpiar clases anteriores dinámicamente
	if (dif >= 2) inputFecha.classList.add("alerta-verde");
	else if (dif === 1) inputFecha.classList.add("alerta-amarillo");
	else if (dif <= 0) inputFecha.classList.add("alerta-rojo");
}

function inicializarEventosPanel() {
	// Forzamos la creación y llenado del datalist antes de renderizar la primera fila
	poblarDatalistProcedimientos();

	const fechaEntrega = document.getElementById("fecha-entrega");
	if (fechaEntrega) fechaEntrega.addEventListener("input", calcularAlertaFecha);

	window.agregarFila();
	window.buscarOrdenes();
	actualizarConsecutivo();

	const fechaAuto = document.getElementById("fecha-auto");
	if (fechaAuto && !fechaAuto.value) {
		fechaAuto.valueAsDate = new Date();
	}
}

function actualizarConsecutivo() {
	const ordenNoInput = document.getElementById("orden-no");
	if (!ordenNoInput) return;
	const historial = JSON.parse(localStorage.getItem("historial_costura")) || [];
	let maxNum = 0;
	historial.forEach((orden) => {
		const num = parseInt(orden.ordenNo, 10);
		if (!isNaN(num) && num > maxNum) maxNum = num;
	});
	ordenNoInput.value = (maxNum + 1).toString().padStart(4, "0");
}

function guardarOrdenEnHistorial() {
	const ordenNo = document.getElementById("orden-no")?.value.trim();
	const clienteNom = document.getElementById("cliente-nom")?.value.trim();
	if (!clienteNom) {
		alert("Por favor, ingrese el nombre del cliente.");
		return false;
	}

	const prendas = [];
	document.querySelectorAll("#tabla-pedidos tbody tr").forEach((tr) => {
		const desc = tr.querySelector(".c-desc").value.trim();
		if (desc) {
			const unitRaw = tr.querySelector(".c-unit").value || "0";
			const totalRaw = tr.querySelector(".c-total").value || "0";

			prendas.push({
				cant: tr.querySelector(".c-cant").value,
				desc,
				unit: unitRaw.replace(/\./g, ""),
				total: totalRaw.replace(/\./g, ""),
			});
		}
	});

	const nuevaOrden = {
		id: Date.now(),
		ordenNo,
		clienteNom,
		fechaReg: document.getElementById("fecha-auto")?.value,
		clienteDir: document.getElementById("cliente-dir")?.value,
		clienteCel: document.getElementById("cliente-cel")?.value,
		fechaEntrega: document.getElementById("fecha-entrega")?.value,
		abonoVal: document.getElementById("abono-val")?.value,
		saldoVal: document.getElementById("display-saldo")?.innerText,
		prendas,
	};

	let historial = JSON.parse(localStorage.getItem("historial_costura")) || [];
	historial = historial.filter((o) => o.ordenNo !== ordenNo);
	historial.unshift(nuevaOrden);
	localStorage.setItem("historial_costura", JSON.stringify(historial));
	return true;
}

function cargarOrden(id) {
	const historial = JSON.parse(localStorage.getItem("historial_costura")) || [];
	const orden = historial.find((item) => item.id === id);
	if (!orden) return;

	document.getElementById("orden-no").value = orden.ordenNo;
	document.getElementById("cliente-nom").value = orden.clienteNom;
	document.getElementById("cliente-dir").value = orden.clienteDir;
	document.getElementById("cliente-cel").value = orden.clienteCel;
	document.getElementById("fecha-auto").value = orden.fechaReg;
	document.getElementById("fecha-entrega").value = orden.fechaEntrega;
	document.getElementById("abono-val").value = orden.abonoVal;

	const tbody = document.querySelector("#tabla-pedidos tbody");
	if (tbody) {
		tbody.innerHTML = "";
		orden.prendas.forEach((p) => {
			const tr = document.createElement("tr");
			const unitFormateado = parseFloat(p.unit).toLocaleString("es-CO");
			const totalFormateado = parseFloat(p.total).toLocaleString("es-CO");

			tr.innerHTML = `
                <td>
                    <input type="number" class="c-cant" value="${p.cant}">
                    <span class="print-text-cell p-cant-txt">${p.cant}</span>
                </td>
                <td>
                    <input type="text" class="c-desc" list="procedimientos" autocomplete="on" value="${p.desc}">
                    <span class="print-text-cell p-desc-txt">${p.desc}</span>
                </td>
                <td>
                    <input type="text" class="c-unit" value="${unitFormateado}">
                    <span class="print-text-cell p-unit-txt">${unitFormateado}</span>
                </td>
                <td>
                    <input type="text" class="c-total" value="${totalFormateado}" readonly>
                    <span class="print-text-cell p-total-txt">${totalFormateado}</span>
                </td>
            `;
			tbody.appendChild(tr);
		});
	}
	vincularCalculos();
	recalcular();
	calcularAlertaFecha();
}

document.addEventListener("DOMContentLoaded", () => {
	const passInput = document.getElementById("admin-pass");
	if (passInput) {
		passInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") window.verificarAcceso();
		});
	}
});
