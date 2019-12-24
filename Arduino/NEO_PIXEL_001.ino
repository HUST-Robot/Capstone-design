#include <Adafruit_NeoPixel.h>
#define PIN 6
//네오픽셀을 사용하기 위해 객체 하나를 생성한다. 
//첫번째 인자값은 네오픽셀의 LED의 개수
//두번째 인자값은 네오픽셀이 연결된 아두이노의 핀번호
//세번째 인자값은 네오픽셀의 타입에 따라 바뀌는 flag
Adafruit_NeoPixel strip = Adafruit_NeoPixel(144, PIN, NEO_GRB + NEO_KHZ800);

// 적외선 센서 핀번호 선언 (입력)
volatile int motion = 2; 
// 릴레이 핀번호 선언 (출력)
volatile int relay = 4;

// 최적화 방지코드
//volatile int motion_state = 0;
void setup() {

// 적외선센서의 핀을 INPUT모드로 선언
pinMode(motion,INPUT);
// 릴레이 핀을 OUPUT으로 선언 
pinMode(relay,OUTPUT);
//digitalWrite(relay, LOW);

 // 모션제어(디지털핀)으로부터 인터럽트 검사
attachInterrupt(digitalPinToInterrupt(2), LEDs, CHANGE);
// 시리얼 통신 속도 설정
Serial.begin(9600);
strip.begin(); //네오픽셀을 초기화하기 위해 모든LED를 off시킨다
strip.show(); 
}

void loop() {
          //아래의 순서대로 NeoPixel을 반복한다.
        //  colorWipe(strip.Color(255, 0, 0), 50); //빨간색 출력
        //  colorWipe(strip.Color(0, 255, 0), 50); //녹색 출력
         // colorWipe(strip.Color(0, 0, 255), 50); //파란색 출력

          theaterChase(strip.Color(127, 127, 127), 0); //흰색 출력
         // theaterChase(strip.Color(127,   0,   0), 50); //빨간색 출력
        //  theaterChase(strip.Color(  0,   0, 127), 50); //파란색 출력

          //화려하게 다양한 색 출력
         // rainbow(20);
         // rainbowCycle(20);
         // theaterChaseRainbow(50);
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

//LEDs 인터럽트 서비스 루틴 (ISR) 코드. LOW(움직임 감지 없을때 동작)

void LEDs()
{
  if(digitalRead(motion)== 0)
  digitalWrite(relay, LOW);
  else
  digitalWrite(relay, HIGH);
}



//NEO PIXEL 함수
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//NeoPixel에 달린 LED를 각각 주어진 인자값 색으로 채워나가는 함수
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
      delay(wait);
  }
}

//모든 LED를 출력가능한 모든색으로 한번씩 보여주는 동작을 한번하는 함수
void rainbow(uint8_t wait) {
  uint16_t i, j;
  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

//NeoPixel에 달린 LED를 각각 다른색으로 시작하여 다양한색으로 5번 반복한다
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;
  for(j=0; j<256*5; j++) { 
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

//입력한 색으로 LED를 깜빡거리며 표현한다
void theaterChase(uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      strip.show();
      delay(wait);
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

//LED를 다양한색으로 표현하며 깜빡거린다
void theaterChaseRainbow(uint8_t wait) {
  for (int j=0; j < 256; j++) {     //256가지의 색을 표현
    for (int q=0; q < 3; q++) {
        for (int i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, Wheel( (i+j) % 255));
        }
        strip.show();
        delay(wait);
        
        for (int i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, 0); 
        }
    }
  }
}

//255가지의 색을 나타내는 함수
uint32_t Wheel(byte WheelPos) {
  if(WheelPos < 85) {
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  } else if(WheelPos < 170) {
   WheelPos -= 85;
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
}
