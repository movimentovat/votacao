document.addEventListener('DOMContentLoaded', function() {
    var divCopiar = document.getElementById('conteudo-pix');
    
    divCopiar.addEventListener('click', function() {
      // Seleciona o conteúdo da tag <p>
      var textoCopiar = this.querySelector('p').innerText;
      
      // Cria um elemento temporário para a seleção e copia
      var inputTemporario = document.createElement('input');
      inputTemporario.setAttribute('value', textoCopiar);
      document.body.appendChild(inputTemporario);
      inputTemporario.select();
      document.execCommand('copy');
      document.body.removeChild(inputTemporario);
      
      // Feedback visual (opcional)
      alert('Texto copiado: ' + textoCopiar);
    });
  });