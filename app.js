
  // Create Dino Constructor
  function Dino(dinos){
        this.species = dinos.species;
        this.weight = dinos.weight;
        this.height = dinos.height;
        this.diet = dinos.diet;
        this.where = dinos.where;
        this.when = dinos.when;
        this.fact = dinos.fact;
        this.image = dinos.image;

    }

  // Fetch Dino API
  const getJSON = async() => {
      return await fetch("http://127.0.0.1:5500/dino.json")
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(err => console.error(err));
    };

  // Create Human Object
  const human = (obj) => {
    const person = new Dino(obj);
    person.inches = obj.inches;
    return person;
  }

  // Make Dinos Objects
  const dinoObjects = (obj) => (obj.Dinos.map(_dino => new Dino(_dino)));

  //ShortHand
  const $$ = (selector) => (document.querySelector(selector))


  // Use IIFE to get human data from form
  const humanForm = (()=>{
      const obj = {}
      let formContainer = $$("#dino-compare");
      let name = $$('#name');
      let weight = $$('#weight');
      let feet = $$('#feet');
      let inches = $$('#inches');
      let diet = $$('#diet');
      let btnCon = $$('#btn-container');

      // On button click, prepare and display infographic
      let btn = $$('#btn').addEventListener('click', ()=>{
        obj.species = name.value,
        obj.weight = weight.value,
        obj.height = feet.value,
        obj.inches = inches.value,
        obj.diet = diet.value,
        obj.where = "Planet Earth",
        obj.when = "Millions of years",
        obj.fact = " ",
        obj.image = "images/human.png"
       
        const person = human(obj); // Create Human Object
        const displayJSON = getJSON().then((result)=>{
        const dinos = dinoObjects(result); // Create Dinosaurs Objects
        const grid = createGrid(dinos, person); // Create the Grid
        })
        // Remove form from screen / clear form fields on button click
        formContainer.classList.add("hidden");
        btnCon.classList.remove("hidden");
        name.value = "";
        weight.value = "";
        feet.value = "";
        inches.value = "";
       
        // Set up back button when grid appears
        let btnBack = $$('#btn-back').addEventListener('click', ()=>{
          let grid = $$('#grid');
          grid.innerHTML = "";
          btnCon.classList.add("hidden");
          formContainer.classList.remove("hidden");
          delete obj;
        })

      })
  })();
   

    // Create Dino Compare Method 1 - Weight
  Dino.prototype.getWeight = (w1, w2) => (w1.weight > w2.weight ? 
      `A ${w1.species} weighs ${w1.weight - w2.weight}lbs more than ${w2.species} does.` :
      `${w2.species} weighs ${w2.weight - w1.weight}lbs more than a ${w1.species} does.`)
  
  // Create Dino Compare Method 2 - Height
  Dino.prototype.getHeight = (h1, h2)=>{
    let dinoHeight = h1.height * 12;
    let humanHeight = h2.height * 12;
    let inches = h2.inches;
    let totalHeight = humanHeight + inches;

    if(dinoHeight > totalHeight){
      return `A ${h1.species} is ${dinoHeight - totalHeight} inches taller than ${h2.species}.`
    }
    else if(totalHeight > dinoHeight ){
      return `${h2.species} is ${totalHeight - dinoHeight} inches taller than a ${h1.species}.`
    }
  }
  // Create Dino Compare Method 3 - Diet
  Dino.prototype.getDiet = (d1, d2) => (d1.diet === d2.diet ? 
    `A ${d1.species} has a ${d1.diet} diet, just like ${d2.species}.` :
    `A ${d1.species} has a ${d1.diet} diet, which is different from ${d2.species}'s ${d2.diet} diet.`
     )


  // Create Grid and Squares
  const createGrid = (dinos, person) => {
        dinos.sort(()=> Math.random()-0.5); // Randomize grid order
        dinos.splice(4,0, person); // Push Human to 4th in Array

        // Create Grid Square
        const square = (_sq, _idx) => {
          let randomFact = [];
          randomFact.push(dinos[_sq].fact);
          randomFact.push(dinos[_sq].getWeight(dinos[_sq], person));
          randomFact.push(dinos[_sq].getHeight(dinos[_sq], person));
          randomFact.push(dinos[_sq].getDiet(dinos[_sq], person));
          randomFact.sort(()=> Math.random()-0.5); // Randomize fact order
          if(_sq === 4){
            const tile = {
              title: dinos[_sq].species,
              image: dinos[_sq].image,
              fact: " "
            }
          }
          const tile = {
            title: dinos[_sq].species,
            image: dinos[_sq].image,
            fact: randomFact
          }

         // Create List element and add Event Listeners for Mouse Over and Mouse Out
          const li = document.createElement('li');
              li.classList.add('grid-item');
              let html = `
              <h3>${tile.title}</h3>
              <img src="${tile.image}"/>
              <p>${tile.fact[0]}</p>`
              li.innerHTML = html;

              if(_idx !== 4){
                li.classList.add('grid-hover'); 
                li.addEventListener('mouseout', ()=>{
                  li.innerHTML = html;
                })    
              
                li.addEventListener('mouseover', ()=>{
                  li.innerHTML = `
                  <h4>${tile.fact[1]}</h4>
                  <h4>${tile.fact[2]}</h4>
                  <h4>${tile.fact[3]}</h4>`
                })
              }
            return li;
         }
         // Render the Grid
         const render = () => {
           const gridArr = [0,1,2,3,4,5,6,7,8]
           const grid = $$('#grid');
           const ul = document.createElement('ul');
           let html = gridArr.map((sq, idx) => {
             ul.appendChild(square(sq, idx)); 
           });
          grid.appendChild(ul);
          return html;
         }
    render();
  }
