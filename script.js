// Configuração inicial e constantes globais

// URL's da nossa API (Backend)

const ENDPOINT_CLIENTES_CPF= 'https://academia-api-xi.vercel.app/clientes/';
const ENDPOINT_LISTA_CLIENTES = "https://academia-api-xi.vercel.app/clientes"
let todosOsClientes = []

// Ligando com os elementos HTML

// Ligando os formulários

// Formulário de cadastro
let formularioCadastro = document.getElementById('cadastro-form');
let inputNomeCadastro = document.getElementById('cadastro-name');
let inputCpfCadastro = document.getElementById('cadastro-cpf');

// Formulário de edição
let formularioAtualizacao = document.getElementById('update-form');
let inputAtualizacaoId = document.getElementById('update-id');
let inputNomeAtualizacao = document.getElementById('update-name');
let inputCpfAtualizacao = document.getElementById('update-cpf');
let inputStatusAtualizacao = document.getElementById('update-status')
let botaoCancelarAtualizacao = document.getElementById('cancel-update')

// Lista (elementos <div>) onde as charadas serão exibidas
let listaClientes = document.getElementById('item-list');

// ===========================================================
// FUNÇÕES PARA INTERAGIR COM API 
// ===========================================================

// READ (Listar as charadas no elemento lista)

async function buscarClientes() {
    console.log("Buscando clientes na API....");
    listaClientes.innerHTML = '<tr><td colspan="4"><p>Carregando clientes...</p></td></tr>'; // Melhor usar colspan para tabela

    try {
        const respostaHttp = await fetch(ENDPOINT_LISTA_CLIENTES);

        if (!respostaHttp.ok) {
            throw new Error(`Erro na API: ${respostaHttp.status} ${respostaHttp.statusText}`);
        }

        // ----> ALTERAÇÃO AQUI: Atribui à variável GLOBAL <----
        todosOsClientes = await respostaHttp.json();
        console.log("Clientes recebidos: ", todosOsClientes); // Verifique se a global foi preenchida

        // ----> Chama a função para exibir usando a GLOBAL <----
        ExibirClientesNaTela(todosOsClientes);

    } catch (erro) {
        console.error(`Falha ao buscar clientes: ${erro}`);
        // Use colspan para a mensagem de erro caber na linha da tabela
        listaClientes.innerHTML = `<tr><td colspan="4"><p style="color: red;">Erro ao carregar clientes: ${erro.message}</p></td></tr>`;
        todosOsClientes = []; // Importante: Limpa a lista global em caso de erro
    }
}

// --- CREATE (cadastrar cliente) ---
async function cadastrarCliente(evento) {
    evento.preventDefault(); // Previne o comportamento padrão do formulário (que é recarregar a página)
    console.log("Tentando cadastrar cliente...");

    const nome = inputNomeCadastro.value; //usa a louça
    const cpf = inputCpfCadastro.value;

    if (!nome || !cpf) {
        showToast(`Por favor, preencha o nome e cpf.`, 'error')
        return;
    } //verificando se os campos estão cheios

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)){
        showToast("Por favor, preencha o nome com letras", 'error')
        return
    }
    if (isNaN(cpf) || cpf.length !== 11){
        showToast("Por favor, preencha o cpf com 11 números", 'error')
        return
    }
    if (todosOsClientes.some(cliente => cliente.cpf === cpf)){
        showToast("Este cpf já está cadastrado no sistema!", 'error')
        return
    }
    const novoCliente = {
        nome: nome,
        cpf: cpf
    }; //cria um array chave valor para pegar a charada e a resposta

    try {
        const respostaHttp = await fetch(ENDPOINT_LISTA_CLIENTES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoCliente)
        }); //espera os valores do formulário e cria o json com o array chave valor

        const resultadoApi = await respostaHttp.json(); //envia para a api

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao cadastrar cliente: ${respostaHttp.status}`);
        }//verifica o status code da API para ver se funcionou

        console.log("Cliente cadastrado com sucesso!", resultadoApi);
        showToast(resultadoApi.mensagem || `Cliente cadastrado com sucesso!`, 'success')

        inputNomeCadastro.value = ''; //lava a louça
        inputCpfCadastro.value = '';

        await buscarClientes();
    }
    catch (erro) {
        console.error("Falha ao cadastrar cliente:", erro);
        showToast(`Erro ao cadastrar cliente: ${erro.message}`, 'error')
    }
}

// --- UPDATE (Atualizar um cadastro existente) ---
async function atualizarCliente(evento) {
    evento.preventDefault();
    console.log("Tentando atualizar cadastro...");

    const id = inputAtualizacaoId.value;
    const nome = inputNomeAtualizacao.value;
    const cpf = inputCpfAtualizacao.value;

    const dadosCadastroAtualizado = {
        nome: nome,
        cpf: cpf,
    };
    if (!id) {
        console.error("ID da cliente para atualização não encontrado!");
        showToast(`Erro interno: ID da cliente não encontrado para atualizar.`, 'error')
        return;
    }
    if (!nome || !cpf) {
        showToast(`Por favor, preencha o nome e cpf para atualizar.`, 'error')
        return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome)){
        showToast("Por favor, preencha o nome com letras", 'error')
        return
    }
    if (isNaN(cpf) || cpf.length !== 11){
        showToast("Por favor, preencha o cpf com 11 números", 'error')
        return
    }

    try {
        const respostaHttp = await fetch(`${ENDPOINT_LISTA_CLIENTES}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosCadastroAtualizado)
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao atualizar cadastro: ${respostaHttp.status}`);
        }

        console.log("Cadastro atualizado com sucesso! ID:", id);
        showToast(resultadoApi.mensagem || `Cadastro realizado com sucesso!`, 'success')

        esconderFormularioAtualizacao();
        await buscarClientes();

    } catch (erro) {
        console.error("Falha ao atualizar cadastro:", erro);
        showToast(`Erro ao atualizar cadastro: ${erro.message}`, 'error')
    }
}

// --- DELETE (Excluir uma charada) ---
async function excluirCliente(id) {
    console.log(`Tentando excluir cadastro com ID: ${id}`);

    if (!confirm(`Tem certeza que deseja excluir o cadastro com ID ${id}? Esta ação não pode ser desfeita.`)) {
        console.log("Exclusão cancelada pelo usuário.");
        return;
    }

    try {
        const respostaHttp = await fetch(`${ENDPOINT_CLIENTES_CPF}${id}`, {
            method: 'DELETE'
        });

        const resultadoApi = await respostaHttp.json();

        if (!respostaHttp.ok) {
            throw new Error(resultadoApi.mensagem || `Erro ao excluir cadastro: ${respostaHttp.status}`);
        }

        console.log("Cadastro excluído com sucesso!", id);
        showToast(resultadoApi.mensagem || `Cadastro excluído com sucesso!`, 'success')

        await buscarClientes();

    } catch (erro) {
        console.error("Falha ao excluir cadastro:", erro);
        showToast(`Erro ao excluir cadastro: ${erro.message}`, 'error')
        alert(`Erro ao excluir cadastro: ${erro.message}`);
    }
}

async function mudarStatus(id) {
    console.log("Tentando modificar status...");
    try{
        const respostaGet = await fetch(`http://10.142.227.101:8000/clientes/id/${id}`, )
        const cliente = await respostaGet.json()
         // Alternar status: se estiver 'ativo', muda pra 'inativo', e vice-versa
         const novoStatus = cliente.status === 'ativo' ? 'inativo' : 'ativo';

         const respostaPut = await fetch(`${ENDPOINT_LISTA_CLIENTES}/${id}`, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 nome: cliente.nome,
                 cpf: cliente.cpf,
                 status: novoStatus
             })
         });
 
         const resultado = await respostaPut.json();
 
         if (!respostaPut.ok) {
             throw new Error(resultado.mensagem || 'Erro ao alterar status');
         }
         showToast('Status atualizado com sucesso!', 'success')
         buscarClientes();
     } catch (erro) {
         console.error('Erro ao mudar status:', erro);
         showToast(`Erro: ${erro.message}`)
     }
 }

function pesquisaClientes() {
    const termo = document.getElementById("buscaCliente").value.toLowerCase().trim();

    let resultado;

    // ---> CORREÇÃO 2: Filtrar a lista GLOBAL 'todosOsClientes' <---
    if (termo) {
        // Filtra a lista que já está na memória
        resultado = todosOsClientes.filter(cliente => {
            // Verificações de segurança (caso nome ou cpf não existam)
            const nomeMatch = cliente.nome && cliente.nome.toLowerCase().includes(termo);
            const cpfMatch = cliente.cpf && cliente.cpf.includes(termo);
            return nomeMatch || cpfMatch;
        });
    } else {
        // Se a busca estiver vazia, mostra todos os clientes
        resultado = todosOsClientes;
    }

    // Exibe o resultado filtrado (ou todos) na tela
    ExibirClientesNaTela(resultado);
}
    
// ============================================================
// FUNÇÕES PARA MANIPULAR O HTML (Atualizar a Página)
// ============================================================

// --- Mostrar as clientes na lista ---
function ExibirClientesNaTela(clientes) {
    console.log("Atualizando a lista de clientes na tela...");
    listaClientes.innerHTML = '';

    if (!clientes || clientes.length === 0) {
        listaClientes.innerHTML = '<p>Nenhum cliente cadastrado ainda.</p>';
        return;
    }

    clientes.sort((a, b) => {
        if (a.status === 'ativo' && b.status !== 'ativo') return -1;
        if (a.status !== 'ativo' && b.status === 'ativo') return 1;
        return a.nome.localeCompare(b.nome);
    });

    for (const cliente of clientes) {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-navy-700');
        row.id = `cliente-${cliente.id}`;
    
        // Definir o estilo do status baseado no status atual do cliente
        const statusStyle = cliente.status === 'ativo' 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-yellow-500/20 text-yellow-400';
    
        row.innerHTML = `
            <td class="py-3 px-4">${cliente.nome}</td>
            <td class="py-3 px-4">${cliente.cpf}</td>
            <td class="py-3 px-4">
                <span class="${statusStyle} px-2 py-1 rounded-full text-sm">
                    ${cliente.status}
                </span>
            </td>
            <td class="py-3 px-4">
                <div class="flex justify-end space-x-2">
                    <button class="status-btn text-navy-300 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors flex items-center">Mudar status
                    </button>
                    <button class="edit-btn p-1 hover:text-yellow-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                            <path d="m15 5 4 4"/>
                        </svg>
                    </button>
                    <button class="delete-btn p-1 hover:text-red-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            <line x1="10" x2="10" y1="11" y2="17"/>
                            <line x1="14" x2="14" y1="11" y2="17"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
    
        const botaoStatus = row.querySelector('.status-btn');
        botaoStatus.addEventListener('click', function() {
            console.log(`Botão Status clicado para o cliente ID: ${cliente.id}`);
            mudarStatus(cliente.id);
        });
    
        const botaoEditar = row.querySelector('.edit-btn');
        botaoEditar.addEventListener('click', function() {
            console.log(`Botão Editar clicado para a cliente ID: ${cliente.id}`);
            exibirFormularioAtualizacao(cliente.id, cliente.nome, cliente.cpf);
        });
    
        const botaoExcluir = row.querySelector('.delete-btn');
        botaoExcluir.addEventListener('click', function() {
            console.log(`Botão Excluir clicado para a cliente ID: ${cliente.id}`);
            excluirCliente(cliente.id);
        });
    
        listaClientes.appendChild(row);
    }
    
}

// --- Mostrar o formulário de atualização (edição) ---
function exibirFormularioAtualizacao(id, nome, cpf) {
    console.log("Mostrando formulário de atualização para o cliente ID:", id);
    inputAtualizacaoId.value = id;
    inputNomeAtualizacao.value = nome;
    inputCpfAtualizacao.value = cpf;

    formularioAtualizacao.classList.remove('hidden');
    formularioCadastro.classList.add('hidden');

    formularioAtualizacao.scrollIntoView({ behavior: 'smooth' });
}

// --- Esconder o formulário de atualização ---
function esconderFormularioAtualizacao() {
    console.log("Escondendo formulário de atualização.");
    formularioAtualizacao.classList.add('hidden');
    formularioCadastro.classList.remove('hidden');

    inputAtualizacaoId.value = '';
    inputNomeAtualizacao.value = '';
    inputCpfAtualizacao.value = '';
}

// ============================================================
// FUNÇÕES DE FEEDBACK (TOASTS)
// ============================================================
function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found!');
        return;
    }

    const toastId = `toast-${Date.now()}`; // ID único para o toast
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    toastElement.classList.add(
        'p-4', 'rounded-lg', 'shadow-lg', 'flex', 'items-start', 'gap-3',
        'text-sm', 'font-medium', 'border',
        'opacity-0', 'translate-x-full', 'transform', 'transition-all', 'duration-300', 'ease-out' // Animação de entrada
    );

    let iconHtml = '';
    // Define cor e ícone com base no tipo
    if (type === 'success') {
        toastElement.classList.add('bg-green-50', 'border-green-300', 'text-green-800');
        iconHtml = '<i data-lucide="check-circle" class="w-5 h-5 text-green-500 flex-shrink-0"></i>';
    } else if (type === 'error') {
        toastElement.classList.add('bg-red-50', 'border-red-300', 'text-red-700');
        iconHtml = '<i data-lucide="x-circle" class="w-5 h-5 text-red-500 flex-shrink-0"></i>';
    } else { // Tipo 'info' ou default
        toastElement.classList.add('bg-blue-50', 'border-blue-300', 'text-blue-700');
        iconHtml = '<i data-lucide="info" class="w-5 h-5 text-blue-500 flex-shrink-0"></i>';
    }

    toastElement.innerHTML = `
        ${iconHtml}
        <div class="flex-1">${message}</div>
        <button class="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300" aria-label="Close">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
    `;

    // Adiciona evento para o botão fechar
    const closeButton = toastElement.querySelector('button');
    closeButton.addEventListener('click', () => removeToast(toastElement));

    // Adiciona o toast ao container
    container.appendChild(toastElement);


    // Força reflow para aplicar estilos iniciais antes da transição
    void toastElement.offsetWidth;

    // Inicia animação de entrada
    toastElement.classList.remove('opacity-0', 'translate-x-full');
    toastElement.classList.add('opacity-100', 'translate-x-0');


    // Define timeout para remover o toast automaticamente
    setTimeout(() => {
        removeToast(toastElement);
    }, duration);
}

function removeToast(toastElement) {
    if (!toastElement || !toastElement.parentNode) return; // Já removido ou não existe

    // Inicia animação de saída
    toastElement.classList.remove('opacity-100', 'translate-x-0');
    toastElement.classList.add('opacity-0', 'translate-x-full'); // Ou outra animação de saída

    // Remove o elemento do DOM após a animação
    setTimeout(() => {
        if (toastElement.parentNode) {
            toastElement.parentNode.removeChild(toastElement);
        }
    }, 300); // Duração da animação de saída (igual à da entrada)
}
//=====================================================================
//EVENT LISTENERS GLOBAIS(Campanhias principais da página)

formularioCadastro.addEventListener('submit',cadastrarCliente);//ao acontecer o submit do botão do formulário, chama a função criar charada
formularioAtualizacao.addEventListener('submit', atualizarCliente);
botaoCancelarAtualizacao.addEventListener('click', esconderFormularioAtualizacao);

//=====================================================================
// INICIALIZAÇÃO DA PÁGINA

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM completamente carregado. Iniciando busca de clientes...");
    buscarClientes();
}); 