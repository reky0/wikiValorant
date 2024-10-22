import { endpoint, language } from "./main.js";

// variables de elementos fijos del layout
const agentPicker = document.getElementById("agent-picker");
const agentInfo = document.getElementById("agent-info");
const name = document.getElementById("agent-name");
const role = document.getElementById("agent-role");
const roleIcon = document.getElementById("agent-role-icon");
const imgBg = document.getElementById("agent-img-bg");
const imgPortrait = document.getElementById("agent-img-portrait");
const desc = document.getElementById("agent-description");

const skillsMenu = document.getElementById("skills");

const skill1Img = document.getElementById("skill1-img");
const skill1Name = document.getElementById("skill1-name");
const skill1Desc = document.getElementById("skill1-desc");

const skill2Img = document.getElementById("skill2-img");
const skill2Name = document.getElementById("skill2-name");
const skill2Desc = document.getElementById("skill2-desc");

const skill3Img = document.getElementById("skill3-img");
const skill3Name = document.getElementById("skill3-name");
const skill3Desc = document.getElementById("skill3-desc");

const ultimateImg = document.getElementById("ultimate-img");
const ultimateName = document.getElementById("ultimate-name");
const ultimateDesc = document.getElementById("ultimate-desc");

// hace la busqueda de la info
// lo de async es para que lo haga en paralelo y la carga 
// de los elementos de la pagina no dependa de ello
async function fetchData() {
    let url = new URL(endpoint + 'agents');
    url.searchParams.append('language', language); // parametro de lenguaje al definido en el main.js
    url.searchParams.append('isPlayableCharacter', 'true'); // para que no salgan repetidos (cosas de la API)

    // realiza peticion GET a la url
    fetch(url, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            // envia la info obtenida a una funcion que la muestra 
            displayData(data['data']);
        })
        .catch(error => console.error('Error:', error));
}


// muestra el contenido buscado
function displayData(data) {
    console.log(data); // por si acaso

    // recorre cada agente de los datos 
    data.forEach(agent => {
        // crea boton de seleccion de personaje
        let newAgent = document.createElement("button");
        // añade clases al boton
        newAgent.setAttribute("class", "agent-button col-sm-12 col-lg-12");

        // crea la imagen que tendra el boton y le añade 
        // la imagen de ese personaje
        let agentImg = document.createElement("img");
        let agentImgSprite = agent['displayIcon'];
        agentImg.src = agentImgSprite;

        newAgent.appendChild(agentImg); // asi el boton ya tiene imagen

        // en caso de ser pulsado
        newAgent.addEventListener("click", async () => {
            // hace el menu de habilidades visible
            skillsMenu.style.display = "block";
            // por defecto la pestaña mostrada es la primera (=la primera habilidad)
            // el metodo esta definido al final del html
            openTab(event, "skill1");
            // a la primera pestaña del menu de habilidades (=la de la primera habilidad) 
            // le pone la clase que indica que esta seleccionada
            document.getElementsByClassName("tab-button")[0].className += " active";

            // busca todos los botones marcados como boton activo (tiene un color de resalte)
            // y les quita dicha caracteristica
            let agentButtons = document.querySelectorAll('.agent-button-active');
            agentButtons.forEach(btn => btn.setAttribute("class", "agent-button col-sm-12 col-lg-12"));
            newAgent.classList.add("agent-button-active");

            let agentBg = agent['background']; // fondo
            let agentPortrait = agent['fullPortrait']; // imagen del personaje
            let agentName = agent['displayName'];
            let agentRole = agent['role']['displayName'];
            let agentRoleIcon = agent['role']['displayIcon'];
            let agentDescription = agent['description'];
            let agentSkill1Img;
            let agentSkill1Name;
            let agentSkill1Desc;
            let agentSkill2Img;
            let agentSkill2Name;
            let agentSkill2Desc;
            let agentSkill3Img;
            let agentSkill3Name;
            let agentSkill3Desc;
            let agentUltimateImg;
            let agentUltimateName;
            let agentUltimateDesc;

            for (let ability of agent['abilities']) {
                switch (ability['slot']) {
                    case 'Ability1':
                        agentSkill1Img = ability['displayIcon'];
                        agentSkill1Name = ability['displayName'];
                        agentSkill1Desc = ability['description'];
                        break;
                    case 'Ability2':
                        agentSkill2Img = ability['displayIcon'];
                        agentSkill2Name = ability['displayName'];
                        agentSkill2Desc = ability['description'];
                        break;
                    case 'Grenade':
                        agentSkill3Img = ability['displayIcon'];
                        agentSkill3Name = ability['displayName'];
                        agentSkill3Desc = ability['description'];
                        break;
                    case 'Ultimate':
                        agentUltimateImg = ability['displayIcon'];
                        agentUltimateName = ability['displayName'];
                        agentUltimateDesc = ability['description'];
                        break;
                }
            }



            // let gradientColors = `#${agentBg[0]}, #${agentBg[1]}, #${agentBg[2]}, #${agentBg[3]}`
            // agentInfo.setAttribute("style", 'background-image: linear-gradient(to right, '+gradientColors+');');


            // funcion que espera que una imagen termine de cargar
            function waitForImageToLoad(imgElement) {
                return new Promise((resolve, reject) => {
                    // Listen for the image load event
                    imgElement.onload = () => resolve();

                    // Listen for an error in loading the image
                    imgElement.onerror = () => reject(new Error('Failed to load the image'));
                });
            }


            try {
                imgBg.setAttribute("src", "" + '?' + new Date().getTime());
                imgPortrait.setAttribute("src", "" + '?' + new Date().getTime());


                // Show the image after it has fully loaded
                imgBg.setAttribute("src", agentBg);
                imgPortrait.setAttribute("src", agentPortrait);

                // espera a que las dos imagenes se carguen
                await Promise.all([waitForImageToLoad(imgBg), waitForImageToLoad(imgPortrait)]);

                imgBg.className += "swipe-left";
                imgPortrait.className += "swipe-right";

                setTimeout(() => {
                    imgBg.className = "";
                    imgPortrait.className = "";
                }, 300);

                name.textContent = agentName.toUpperCase();
                role.textContent = agentRole.toUpperCase();
                roleIcon.src = agentRoleIcon;
                desc.textContent = agentDescription;

                skill1Img.setAttribute("src", agentSkill1Img);
                skill1Name.textContent = agentSkill1Name;
                skill1Desc.textContent = agentSkill1Desc;

                skill2Img.setAttribute("src", agentSkill2Img);
                skill2Name.textContent = agentSkill2Name;
                skill2Desc.textContent = agentSkill2Desc;

                skill3Img.setAttribute("src", agentSkill3Img);
                skill3Name.textContent = agentSkill3Name;
                skill3Desc.textContent = agentSkill3Desc;

                ultimateImg.setAttribute("src", agentUltimateImg);
                ultimateName.textContent = agentUltimateName;
                ultimateDesc.textContent = agentUltimateDesc;

            } catch (error) {
                console.error(error.message);
            }


            
        })
        agentPicker.appendChild(newAgent);

    })
}

fetchData();