// Declarações dos elementos HTML para o DOM
const videoElemento = document.getElementeById("video");
const botaoScanner = document.getElementById('btn-texto');
const resultado = document.getElementById('saida');
const canvas = document.getElementById('canvas')

// Método Ligar Câmera

async function configurarCamera(){
    try{
        // solicita a permissão para acessar a câmera do usuário
        const midia=await navigator.mediaDevices.getUserMedia({
            // habilita a câmera traseira do celular
            video:{facingMOde:"environment"},
            audio=false
        })
        // atribui o fluxo da câmera ao elemento de 
        // vídeo para visualizar
        videoElemento.srcObject=midia;

    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera",erro;
    }
}

// executa a função para habilitar a câmera
configurarCamera();

// capturar o texto da câmera
botaoScanner.onclick=async()=>{
    botaoScanner.disabled=true;
    resultado.innerText="fazendo a leitura... aguarde"

    // captura a imagem(foto)
    const contexto = canvas.getContext("2d");

    // Ajusta o tamanho do canvas interno para ser igual
    // a do vídeo
    canvas.width=videoElemento.videoWidth;
    canvas.height=videoElemento.videoHeight;

    // desenha o frame atual do vídeo dentro do canvas(tira a foto)
    contexto.drawImage(videoElemento,0,0,canvas,canvas.height);

    // processando com a API Tesseract
    try{
        const  {data:{text}}=await Tesseract.recognize(
            canvas,
            'por',
            {looger: m=>console.log(m)} //mostra no log
        )
        resultado.innerText=text.trim().lenght > 0 ? text : "Não foi possível identificar o texto."
    }catch(erro){
        resultado.innerText="Erroo no processamento", erro.message;
    }
    finally{
        //habilita o botão para uma nova leitura
        botaoScanner.disabled=false;
    }
}