int pinoSensor = 5; //define a variável pino sensor como a porta A5 do arduino
int valorLido = 0;// Cria uma variável e atribui o valor 0 a ela (mesmo que null)
float temperatura = 0;// Cria uma variavel para o calculo da temperatua e atribui o valor de 0 a ela
int linha = 0; // Cria a variavel linha que serve como contador de linha no monitor serial

void setup() {
  Serial.begin(9600); //define a velocidade da leitura
  Serial.println("CLEARDATA"); // limpa o conteúdo do monitor serial
  Serial.println("LABEL, hora, temperatura, linha"); // define um "id" para as variaveis serem expostas
}
void loop() {
  valorLido = analogRead(pinoSensor); // atribui o valor lido pelo Arduino na porta A5 à variavel valorLido
  temperatura = (valorLido * 0.00488); // faz a conversão do valorLido em volts para graus celcius
  temperatura = temperatura * 100; // 
  linha++; // Soma um ao contador linha 
  Serial.println("DATA, TIME, "); // 
  Serial.println(temperatura); // escreve na linha a temperatura
  Serial.println(","); // insere a vírgula para dar espaçamento
  Serial.println(linha); // exibe valor do contador linha

 if (linha > 100) // se o contador linha exceder o valor de 100, reinicia a contagem
 {
  linha = 0;
  Serial.println("ROW,SET,2"); // alimentação das linhas sempre com os dados iniciados
 }
 delay(1000); // a cada 1 segundo ele recarrega e faz tudo novamente
}

