#include "DHT.h";
#define DHTPIN A0   // Define o pino do arduino como A0
#define DHTTYPE DHT11  //Define que estamos usando o sensor DHT 11 
DHT dht(DHTPIN, DHTTYPE); // Informa para a Biblioteca o pino e tipo do sensor (previamente definidos)

void setup() 
{
    Serial.begin(115200); // define a velocidade de resposta do sensor
    dht.begin(); //Inicia a Biblioteca do DHT
}

void loop() 
{
    float h = dht.readHumidity(); // Cria uma variavel (h) que recebe o valor lido de humidade 
    float t = dht.readTemperature(); // Cria uma variavel (t) que recebe o valor lido de temperatura  

      if (isnan(t) || isnan(h)) // SE um dos valores for NAN (Not A Number) 
    {
        Serial.println("Erro de leitura no DHT");//Exibe a mensagem de erro.
    } else // Senão
    {
        Serial.print(t);//Exibe o valor da variavel (h) no monitor serial
        Serial.print(":"); 
        Serial.println(h); //Exibe o valor da variavel (t) monitor serial
        delay (2000);
    }
}
