function fcfs(solicitudes, posicionInicial) {
    const secuencia = [posicionInicial];
    let distanciaTotal = 0, posicionActual = posicionInicial;
    const movimientos = [];
    for (const solicitud of solicitudes) {
        const distancia = Math.abs(posicionActual - solicitud);
        distanciaTotal += distancia;
        movimientos.push(distancia);
        posicionActual = solicitud;
        secuencia.push(solicitud);
    }
    return { secuencia, distanciaTotal, movimientos };
}

function sstf(solicitudes, posicionInicial) {
    const secuencia = [posicionInicial];
    let distanciaTotal = 0, posicionActual = posicionInicial;
    const pendientes = [...solicitudes], movimientos = [];
    while (pendientes.length > 0) {
        let minDist = Infinity, minIndex = 0;
        for (let i = 0; i < pendientes.length; i++) {
            const dist = Math.abs(posicionActual - pendientes[i]);
            if (dist < minDist) { minDist = dist; minIndex = i; }
        }
        distanciaTotal += minDist;
        movimientos.push(minDist);
        posicionActual = pendientes[minIndex];
        secuencia.push(posicionActual);
        pendientes.splice(minIndex, 1);
    }
    return { secuencia, distanciaTotal, movimientos };
}

function scan(solicitudes, posicionInicial, tamanoDisco, direccion) {
    const secuencia = [posicionInicial];
    let distanciaTotal = 0, posicionActual = posicionInicial;
    const movimientos = [];
    const izq = solicitudes.filter(s => s < posicionInicial).sort((a, b) => b - a);
    const der = solicitudes.filter(s => s >= posicionInicial).sort((a, b) => a - b);
    const procesarLista = (lista) => {
        for (const s of lista) {
            const d = Math.abs(posicionActual - s);
            distanciaTotal += d; movimientos.push(d);
            posicionActual = s; secuencia.push(s);
        }
    };
    if (direccion === "derecha") {
        procesarLista(der);
        if (der.length > 0 && posicionActual !== tamanoDisco - 1) {
            const d = Math.abs(posicionActual - (tamanoDisco - 1));
            distanciaTotal += d; movimientos.push(d);
            posicionActual = tamanoDisco - 1; secuencia.push(posicionActual);
        }
        procesarLista(izq);
    } else {
        procesarLista(izq);
        if (izq.length > 0 && posicionActual !== 0) {
            const d = Math.abs(posicionActual);
            distanciaTotal += d; movimientos.push(d);
            posicionActual = 0; secuencia.push(posicionActual);
        }
        procesarLista(der);
    }
    return { secuencia, distanciaTotal, movimientos };
}

function look(solicitudes, posicionInicial, direccion) {
    const secuencia = [posicionInicial];
    let distanciaTotal = 0, posicionActual = posicionInicial;
    const movimientos = [];
    const izq = solicitudes.filter(s => s < posicionInicial).sort((a, b) => b - a);
    const der = solicitudes.filter(s => s >= posicionInicial).sort((a, b) => a - b);
    const procesarLista = (lista) => {
        for (const s of lista) {
            const d = Math.abs(posicionActual - s);
            distanciaTotal += d; movimientos.push(d);
            posicionActual = s; secuencia.push(s);
        }
    };
    if (direccion === "derecha") { procesarLista(der); procesarLista(izq); }
    else { procesarLista(izq); procesarLista(der); }
    return { secuencia, distanciaTotal, movimientos };
}

function crearGrafica(idCanvas, secuencia, movimientos, nombre) {
    const ctx = document.getElementById(idCanvas).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: secuencia.map((_, i) => `Paso ${i}`),
            datasets: [{
                label: 'Posición del Cilindro',
                data: secuencia,
                borderColor: '#43a047',
                backgroundColor: 'rgba(67, 160, 71, 0.1)',
                borderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#43a047',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: true, position: 'top', labels: { color: '#000', font: { size: 12, weight: 'bold' } } },
                tooltip: {
                    backgroundColor: 'rgba(46,125,50,0.9)',
                    titleColor: '#000',
                    bodyColor: '#000',
                    borderColor: '#43a047',
                    borderWidth: 2,
                    padding: 12,
                    callbacks: {
                        title: (ctx) => `${nombre} - ${ctx[0].label}`,
                        label: (ctx) => {
                            const idx = ctx.dataIndex;
                            const cil = ctx.parsed.y;
                            const mov = idx > 0 ? movimientos[idx - 1] : 0;
                            const acum = movimientos.slice(0, idx).reduce((a, b) => a + b, 0);
                            return [`Cilindro: ${cil}`, `Movimiento: ${mov}`, `Acumulado: ${acum}`];
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#000', font: { size: 11 } }, title: { display: true, text: 'Cilindro', color: '#000', font: { size: 13, weight: 'bold' } } },
                x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#000', font: { size: 11 } }, title: { display: true, text: 'Secuencia', color: '#000', font: { size: 13, weight: 'bold' } } }
            }
        }
    });
}

function simular() {
    const txtSol = document.getElementById('solicitudes').value;
    const solicitudes = txtSol.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    const posicionInicial = parseInt(document.getElementById('posicionInicial').value);
    const tamanoDisco = parseInt(document.getElementById('tamanoDisco').value);
    const algoritmo = document.getElementById('algoritmo').value;
    const direccion = document.getElementById('direccion').value;
    
    if (solicitudes.length === 0 || isNaN(posicionInicial) || isNaN(tamanoDisco)) {
        alert('Ingrese valores válidos');
        return;
    }
    
    const divRes = document.getElementById('resultados');
    divRes.innerHTML = '';
    divRes.style.display = 'block';
    
    const algos = algoritmo === 'all' 
        ? [
            { nombre: 'FCFS', func: fcfs, args: [solicitudes, posicionInicial] },
            { nombre: 'SSTF', func: sstf, args: [solicitudes, posicionInicial] },
            { nombre: 'SCAN', func: scan, args: [solicitudes, posicionInicial, tamanoDisco, direccion] },
            { nombre: 'LOOK', func: look, args: [solicitudes, posicionInicial, direccion] }
          ]
        : [{ 
            nombre: algoritmo.toUpperCase(), 
            func: window[algoritmo], 
            args: algoritmo === 'scan' ? [solicitudes, posicionInicial, tamanoDisco, direccion] : algoritmo === 'look' ? [solicitudes, posicionInicial, direccion] : [solicitudes, posicionInicial]
          }];
    
    algos.forEach((alg, idx) => {
        const res = alg.func(...alg.args);
        const idC = `chart-${idx}`;
        const prom = (res.distanciaTotal / res.movimientos.length).toFixed(2);
        const max = Math.max(...res.movimientos);
        
        let html = `<div class="resultado-algoritmo"><h3><i class="bi bi-graph-up"></i> ${alg.nombre}</h3>`;
        html += `<div class="cuadricula-estadisticas">`;
        html += `<div class="tarjeta-estadistica"><div class="valor-estadistica">${res.distanciaTotal}</div><div class="etiqueta-estadistica">Distancia Total</div></div>`;
        html += `<div class="tarjeta-estadistica"><div class="valor-estadistica">${prom}</div><div class="etiqueta-estadistica">Promedio</div></div>`;
        html += `<div class="tarjeta-estadistica"><div class="valor-estadistica">${max}</div><div class="etiqueta-estadistica">Máximo</div></div>`;
        html += `<div class="tarjeta-estadistica"><div class="valor-estadistica">${res.secuencia.length - 1}</div><div class="etiqueta-estadistica">Pasos</div></div>`;
        html += `</div><div class="secuencia">`;
        res.secuencia.forEach((v, i) => {
            if (i > 0) html += '<span class="flecha">→</span>';
            html += `<span class="item-secuencia">${v}</span>`;
        });
        html += `</div><div class="contenedor-grafica"><canvas id="${idC}"></canvas></div></div>`;
        divRes.innerHTML += html;
    });
    
    setTimeout(() => {
        algos.forEach((alg, idx) => {
            const res = alg.func(...alg.args);
            crearGrafica(`chart-${idx}`, res.secuencia, res.movimientos, alg.nombre);
        });
    }, 100);
}

 if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker-simulator.js');
            });
        }