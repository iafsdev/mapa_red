import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

// Variables globales
let diagramDefinition = '';
let mainTopic = '';
let nodos = new Map();
let contador = 1;
let graphType = '';

/**
 * Inicializa la configuración de Mermaid según el tipo de gráfico.
 * @param {string} type - Tipo de gráfico ('conceptMap' o 'semanticNetwork').
 */
function initializeMermaid(type) {
  let config = {
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
      primaryColor: '#E1F5FE',
      primaryTextColor: '#000000',
      primaryBorderColor: '#00B0FF',
      lineColor: '#00B0FF',
      secondaryColor: '#F0F4C3',
      tertiaryColor: '#FFFFFF'
    }
  };

  if (type === 'semanticNetwork') {
    config.flowchart = {
      curve: 'basis',
      nodeSpacing: 50,
      rankSpacing: 50,
      padding: 15
    };
  }

  mermaid.initialize(config);
}

/**
 * Inicia el proceso de creación del gráfico.
 * Esta función se llama cuando el usuario hace clic en "Comenzar gráfico".
 */
window.startGraph = function() {
  graphType = document.getElementById('graphType').value;
  mainTopic = document.getElementById('mainTopic').value.trim();

  if (mainTopic) {
    initializeMermaid(graphType);
    document.getElementById('initialForm').style.display = 'none';
    document.getElementById('relationForm').style.display = 'block';
    document.getElementById('diagramContainer').style.display = 'block';
    
    let graphTitle = graphType === 'conceptMap' ? 'Mapa Conceptual' : 'Red Semántica';
    document.getElementById('graphTitle').textContent = `${graphTitle}: ${mainTopic}`;
    
    if (graphType === 'conceptMap') {
      diagramDefinition = `graph TD;\n1[${mainTopic}];`;
      document.getElementById('startNodeInput').style.display = 'none';
      document.getElementById('endNodeInput').style.display = 'block';
      document.getElementById('endNodeSelect').style.display = 'none';
    } else {
      diagramDefinition = `graph LR;\n1(("${mainTopic}"));`;
      document.getElementById('startNodeInput').style.display = 'block';
      document.getElementById('endNodeInput').style.display = 'block';
      document.getElementById('endNodeSelect').style.display = 'block';
    }
    
    nodos.set(1, mainTopic);
    updateNodeOptions();
    renderDiagram(diagramDefinition);
  } else {
    alert('Por favor, ingrese el tema principal.');
  }
}

/**
 * Añade una nueva relación al gráfico.
 * Esta función se llama cuando el usuario hace clic en "Agregar Relación".
 */
window.addRelation = function() {
  let startNode, endNode;
  const conector = document.getElementById('conector').value.trim();

  if (graphType === 'conceptMap') {
    startNode = document.getElementById('startNodeSelect').value;
    endNode = document.getElementById('endNodeInput').value.trim();
  } else {
    startNode = document.getElementById('startNodeSelect').value || document.getElementById('startNodeInput').value.trim();
    endNode = document.getElementById('endNodeSelect').value || document.getElementById('endNodeInput').value.trim();
  }

  if (startNode && endNode && (conector || graphType === 'conceptMap')) {
    let startNodeId = getNodeId(startNode);
    let endNodeId = getNodeId(endNode);

    if (graphType === 'conceptMap') {
      diagramDefinition += conector ? 
        `\n${startNodeId}[${startNode}] -- ${conector} --> ${endNodeId}[${endNode}];` :
        `\n${startNodeId}[${startNode}] --> ${endNodeId}[${endNode}];`;
    } else {
      diagramDefinition += `\n${startNodeId}(("${startNode}")) -- "${conector}" --> ${endNodeId}(("${endNode}"));`;
    }

    renderDiagram(diagramDefinition);
    updateNodeOptions();
    resetInputStates();
  } else {
    if (graphType === 'semanticNetwork' && !conector) {
      alert('Por favor, complete el campo del conector para la red semántica.');
    } else {
      alert('Por favor, complete tanto el nodo inicial como el nodo final.');
    }
  }
}

/**
 * Obtiene el ID de un nodo, creando uno nuevo si no existe.
 * @param {string} nodeName - Nombre del nodo.
 * @returns {number} ID del nodo.
 */
function getNodeId(nodeName) {
  for (let [id, name] of nodos) {
    if (name === nodeName) {
      return id;
    }
  }
  contador++;
  nodos.set(contador, nodeName);
  return contador;
}

/**
 * Actualiza las opciones de los selectores de nodos.
 */
function updateNodeOptions() {
  const startNodeSelect = document.getElementById('startNodeSelect');
  const endNodeSelect = document.getElementById('endNodeSelect');
  startNodeSelect.innerHTML = '<option value="">Seleccione un nodo existente</option>';
  endNodeSelect.innerHTML = '<option value="">Seleccione un nodo existente</option>';

  nodos.forEach((value, key) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${key}: ${value}`;
    startNodeSelect.appendChild(option.cloneNode(true));
    endNodeSelect.appendChild(option);
  });

  // Agregar event listeners para manejar la selección/input
  startNodeSelect.addEventListener('change', function() {
    document.getElementById('startNodeInput').value = '';
    document.getElementById('startNodeInput').disabled = this.value !== '';
  });

  endNodeSelect.addEventListener('change', function() {
    document.getElementById('endNodeInput').value = '';
    document.getElementById('endNodeInput').disabled = this.value !== '';
  });

  document.getElementById('startNodeInput').addEventListener('input', function() {
    startNodeSelect.value = '';
  });

  document.getElementById('endNodeInput').addEventListener('input', function() {
    endNodeSelect.value = '';
  });
}

/**
 * Resetea el estado de los inputs después de agregar una relación.
 */
function resetInputStates() {
  document.getElementById('startNodeSelect').selectedIndex = 0;
  document.getElementById('endNodeSelect').selectedIndex = 0;
  document.getElementById('startNodeInput').value = '';
  document.getElementById('endNodeInput').value = '';
  document.getElementById('conector').value = '';

  // Desbloquear los inputs de texto
  document.getElementById('startNodeInput').disabled = false;
  document.getElementById('endNodeInput').disabled = false;
}

/**
 * Renderiza el diagrama usando Mermaid.
 * @param {string} definition - Definición del diagrama en sintaxis Mermaid.
 */
async function renderDiagram(definition) {
  const diagram = document.getElementById('diagram');
  
  try {
    const { svg } = await mermaid.render('generatedDiagram', definition);
    diagram.innerHTML = svg;

    const svgElement = diagram.querySelector('svg');
    if (svgElement) {
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', 'auto');
    }

    console.log(diagramDefinition);
  } catch (error) {
    console.log("Error al renderizar el diagrama: ", error);
  }

  mermaid.contentLoaded();
}