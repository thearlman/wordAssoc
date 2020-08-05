console.log(`
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  Welcome Home!
This little website uses vis.js https://visjs.org/
and dataMuse https://www.datamuse.com/api/
My name is Asa, and I like to make things.
You can find me at: https://asas.website/
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`);

let nodes = [];
let network;

function createNetwork() {
  tags.forEach((item, i) => {
    nodes.push({
      id: i,
      label: item
    });
  });

  // create a network
  let container = document.getElementById('mynetwork');
  let data = {
    nodes: nodes,
    // edges: edges
  };
  let options = {
    physics: {
      stabilization: {
        iterations: 10,
      },
      timestep: .3,
      adaptiveTimestep: true,
      barnesHut: {
        gravitationalConstant: -3500,
        springLength: 10,
        // springConstant: .05,
        avoidOverlap: .5
      }
    },
    layout: {
      improvedLayout: false,
    },
    nodes: {
      shape: "circle",
      margin: 10,
      color: {
        border: '#000000',
        background: '#377EB8',
        highlight: {
          border: '#000000',
          background: '#4CAF4A'
        },
        hover: {
          border: '#2B7CE9',
          background: '#D2E5FF'
        }
      },
    }
  };
  network = new vis.Network(container, data, options);
  network.on("click", function(properties) {
    // console.log(properties.nodes[0]);
    (typeof properties.nodes[0] !== "undefined") ?
    makeConnections(properties.nodes[0]):
      console.log("nope");

  })
}

createNetwork();

function makeConnections(nodeNumber) {
  // console.log(nodeNumber);
  let matchingTags = {};
  let selectedTag = tags[nodeNumber];
  tags.forEach((tag, i) => {
    matchingTags[tag] = [];
    if (tag !== selectedTag) {
      tagAssociations[selectedTag].forEach((selTagAssoc, e) => {
        tagAssociations[tag].forEach((tagAssoc, f) => {
          if (selTagAssoc === tagAssoc) {
            matchingTags[tag].push(tagAssoc);
          }
        });
      });
    }
  });
  drawConnections(nodeNumber, matchingTags);
}

function drawConnections(nodeNumber, matchingTags) {
  removeAllEdges();
  for (var i = 0; i < Object.keys(matchingTags).length; i++) {
    let tag = Object.keys(matchingTags)[i];
    if (matchingTags[tag].length > 0) {
      network.body.data.edges.add([{
        from: nodeNumber,
        to: i
      }]);
      let tagList = "";
      matchingTags[tag].forEach((item, i) => {
        tagList += item + "<br>";
      });
      network.body.nodes[i].options.title = tagList;
    }
  }
}

function removeAllEdges() {
  network.body.data.edges.forEach((item, i) => {
    network.body.data.edges.remove([i]);
  });


}
