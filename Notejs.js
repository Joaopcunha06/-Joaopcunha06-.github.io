
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const pedirCaminhoArquivo = () => {
  return new Promise((resolve) => {
    rl.question('Por favor, insira o caminho do arquivo .txt: ', (caminho) => {
      resolve(caminho);
    });
  });
};
const lerArquivo = (caminho) => {
  return new Promise((resolve, reject) => {
    fs.readFile(caminho, 'utf8', (err, dados) => {
      if (err) {
        reject('Erro ao ler o arquivo: ' + err.message);
      } else {
        resolve(dados.split('\n')); 
      }
    });
  });
};

// Função para processar as linhas e calcular os resultados
const processarLinhas = (linhas) => {
  let somaNumeros = 0;
  let linhasComTexto = 0;
  let linhasComNumeros = 0;

  linhas.forEach((linha) => {
    const linhaTratada = linha.trim();
    
    // Se a linha contém apenas números
    if (/^\d+$/.test(linhaTratada)) {
      somaNumeros += parseInt(linhaTratada, 10);
      linhasComNumeros++;
    } else if (linhaTratada) {
      // Se a linha contém texto (mesmo que tenha números misturados)
      linhasComTexto++;
    }
  });

  return {
    somaNumeros,
    linhasComTexto,
  };
};

// Função para exibir o resumo
const exibirResumo = (resultado, tempoInicial) => {
  const tempoFinal = new Date().getTime();
  const tempoExecucao = (tempoFinal - tempoInicial) / 1000;

  console.log('\nResumo da execução:');
  console.log(`- Soma dos números dentro do arquivo: ${resultado.somaNumeros}`);
  console.log(`- Quantidade de linhas com texto: ${resultado.linhasComTexto}`);
  console.log(`- Tempo de execução: ${tempoExecucao.toFixed(2)} segundos`);
};

// Função principal para executar a aplicação
const executarAplicacao = async () => {
  try {
    // Pedir o caminho do arquivo ao usuário
    const caminhoArquivo = await pedirCaminhoArquivo();
    
    const tempoInicial = new Date().getTime(); // Marca o tempo inicial

    const linhas = await lerArquivo(caminhoArquivo);

    const resultado = processarLinhas(linhas);

    exibirResumo(resultado, tempoInicial);

    // Perguntar se o usuário deseja executar novamente
    rl.question('\nDeseja executar novamente? (s/n): ', (resposta) => {
      if (resposta.toLowerCase() === 's') {
        executarAplicacao(); // Se 'sim', reinicia a aplicação
      } else {
        console.log('Obrigado por usar a aplicação!');
        rl.close(); // Se 'não', encerra a interface de leitura
      }
    });
  } catch (error) {
    console.error(error);
    rl.close(); // Em caso de erro, encerra a interface
  }
};

// Iniciar a aplicação
executarAplicacao();
