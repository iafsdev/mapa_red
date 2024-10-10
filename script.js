import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

mermaid.initialize({ 
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#007bff',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#007bff',
    lineColor: '#007bff',
    secondaryColor: '#6c757d',
    tertiaryColor: '#ffffff'
  }
});

let diagramDefinition = 'graph TD;';
let mainTopic = '';
let nodos = new Map();
let contador = 1;

window.startConceptMap = function() {
  mainTopic = document.getElementById('mainTopic').value.trim();
  if (mainTopic) {
    document.getElementById('initialForm').style.display = 'none';
    document.getElementById('relationForm').style.display = 'block';
    document.getElementById('conceptMapTitle').textContent = `Mapa Conceptual: ${mainTopic}`;
    diagramDefinition = `graph TD;\n1[${mainTopic}];`;
    nodos.set(1, mainTopic);
    updateStartNodeOptions();
    renderDiagram(diagramDefinition);
  } else {
    alert('Por favor, ingrese el tema principal del mapa conceptual.');
  }
}

window.addRelation = function() {
  const startNodeSelect = document.getElementById('startNode');
  const startNode = startNodeSelect.value;
  const endNode = document.getElementById('endNode').value.trim();
  const conector = document.getElementById('conector').value.trim();

  let startNodeText = nodos.get(Number(startNode));

  if (startNode && endNode) {
    contador += 1;
    diagramDefinition += conector ? 
      `\n${startNode}[${startNodeText}] -- ${conector} --> ${contador}[${endNode}];` :
      `\n${startNode}[${startNodeText}] --> ${contador}[${endNode}];`;
    renderDiagram(diagramDefinition);
    nodos.set(contador, endNode);
    updateStartNodeOptions();

    // Limpiar los campos después de agregar la relación
    startNodeSelect.selectedIndex = 0;
    document.getElementById('endNode').value = '';
    document.getElementById('conector').value = '';
  } else {
    alert('Por favor, complete tanto el nodo inicial como el nodo final.');
  }
}

function updateStartNodeOptions() {
  const startNodeSelect = document.getElementById('startNode');
  startNodeSelect.innerHTML = ''; // Limpiar opciones existentes

  nodos.forEach((value, key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = `${key}: ${value}`;
    startNodeSelect.appendChild(option);
  });
}

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