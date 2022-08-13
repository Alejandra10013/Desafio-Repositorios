const urlBase = "https://api.github.com/users";

const request = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

const getUser = async (nombreUsuario) => {
    const usuario = `${urlBase}/${nombreUsuario}`;
    let result = await request(usuario);
    return result;
}

const getRepo = async (nombreUsuario, pagina, repoPagina) => {
    const repositorio = `${urlBase}/${nombreUsuario}/repos?page=${pagina}&per_page=${repoPagina}`;
    let result = await request(repositorio);
    return result;
}

let formulario = document.querySelector("form");

formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombreUsuario = document.getElementById("nombre").value;
    const pagina = document.getElementById("pagina").value;
    const repoPagina = document.getElementById("repoPagina").value;

    if (nombreUsuario == null || nombreUsuario == "", pagina == null || pagina == "", repoPagina == null || repoPagina == "") {

        alert("Complete el formulario");

    } else {
        Promise.all([getUser(nombreUsuario), getRepo(nombreUsuario, pagina, repoPagina)])
            .then(resp => {

                let resultados = document.getElementById("resultados");

                if (resp[0].name == null) {
                    throw new Error('El usuario no existe');
                }
                else {
                    $("#resultados-section").show();
                    resultados.innerHTML =
                        `
                        <table class="container">
                            <tr>
                                <th class="font-weight-normal h3">Datos de Usuario</th>
                                <th class="font-weight-normal h3">Nombre de repositorios</th>
                            </tr>
                            <tr>
                                <td>
                                    <img src=${resp[0].avatar_url} class="avatar py-4" width="30%" height="30%">
                                    <p>Nombre de Usuario: ${resp[0].name}</p>
                                    <p>Nombre de login: ${resp[0].login}</p>
                                    <p>Cantidad de repositorios: ${resp[0].public_repos}</p>
                                    <p>Localidad: ${resp[0].location}</p>
                                    <p>Tipo de usuario: ${resp[0].type}</p>
                                </td>
                                <td id="segundaColumna"></td>
                            </tr>
                        </table>
                    `;

                    for (let i = 0; i < resp[1].length; i++) {
                        $('#segundaColumna').append(`<a href=${resp[1][i].html_url} target='_blank'>${resp[1][i].name}</a></br>`);
                    }
                }
            })
            .catch(error => alert(error));
    }
    document.getElementById("nombre").value = "";
    document.getElementById("pagina").value = "";
    document.getElementById("repoPagina").value = "";
});