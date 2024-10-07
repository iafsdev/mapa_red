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

window.addRelation = function (){
  const startNode = document.getElementById('startNode').value.trim();
  const endNode = document.getElementById('endNode').value.trim();
  const conector = document.getElementById('conector').value.trim();

  if(startNode && endNode){
    diagramDefinition += conector == '' ? `\n${startNode}-->${endNode};` : `\n${startNode}-- ${conector} -->${endNode};`;
    renderDiagram(diagramDefinition);
  }
}

async function renderDiagram(definition){
  const diagram = document.getElementById('diagram');
  
  try {
    const { svg } = await mermaid.render('generatedDiagram', definition);
    diagram.innerHTML = svg;

    const svgElement = diagram.querySelector('svg');
    if(svgElement){
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', auto);
    }

    console.log(diagramDefinition)
  } catch (error) {
    console.log("Error al renderizar el diagrama: ", error);
  }

  mermaid.contentLoaded();
}