#include <Adafruit_NeoPixel.h>

// constants won't change. They're used here to set pin numbers:

// the number of the Arcade button pins on the arduino
const int MassiveButtonPin1 = 8;
const int MassiveButtonPin2 = 9;
const int MassiveButtonPin3 = 10;
const int MassiveButtonPin4 = 11;

// the number of the Red button pins on the arduino
const int RedButtonPin1 = 2;
const int RedButtonPin2 = 3;
const int RedButtonPin3 = 4;
const int RedButtonPin4 = 5;

// the number of the White button pins on the arduino
const int WhiteButtonPin1 = 6;

// variables will change:

// variable for reading the Arcade button status
int MassiveButtonState1 = 0;
int MassiveButtonState2 = 0;
int MassiveButtonState3 = 0;
int MassiveButtonState4 = 0;

// variable for reading the red button status
int RedButtonState1 = 0;
int RedButtonState2 = 0;
int RedButtonState3 = 0;
int RedButtonState4 = 0;

// variable for reading the white button status
int WhiteButtonState1 = 0;

//These instructions are for the neopixel
#define LEDPIN1 2

#define LEDPIN2 12

#define NUM_LEDS 1

#define BRIGHTNESS 255

Adafruit_NeoPixel led1 = Adafruit_NeoPixel(NUM_LEDS, LEDPIN1, NEO_GRBW + NEO_KHZ800);
Adafruit_NeoPixel led2 = Adafruit_NeoPixel(NUM_LEDS, LEDPIN2, NEO_GRBW + NEO_KHZ800);


byte neopix_gamma[] = {
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
  2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
  5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
  10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
  17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
  25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
  37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
  51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
  69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
  90, 92, 93, 95, 96, 98, 99, 101, 102, 104, 105, 107, 109, 110, 112, 114,
  115, 117, 119, 120, 122, 124, 126, 127, 129, 131, 133, 135, 137, 138, 140, 142,
  144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 167, 169, 171, 173, 175,
  177, 180, 182, 184, 186, 189, 191, 193, 196, 198, 200, 203, 205, 208, 210, 213,
  215, 218, 220, 223, 225, 228, 231, 233, 236, 239, 241, 244, 247, 249, 252, 255
};


void setup() {

  // initialize the baud rate
  Serial.begin(9600);

  // initialize the pushbutton pin as an input:
  pinMode(MassiveButtonPin1, INPUT_PULLUP);
  pinMode(MassiveButtonPin2, INPUT_PULLUP);
  pinMode(MassiveButtonPin3, INPUT_PULLUP);
  pinMode(MassiveButtonPin4, INPUT_PULLUP);

  pinMode(RedButtonPin1, INPUT_PULLUP);
  pinMode(RedButtonPin2, INPUT_PULLUP);
  pinMode(RedButtonPin3, INPUT_PULLUP);
  pinMode(RedButtonPin4, INPUT_PULLUP);

  pinMode(WhiteButtonPin1, INPUT_PULLUP);

  //Initialize LEDs
  led1.setBrightness(BRIGHTNESS);
  led2.setBrightness(BRIGHTNESS);
  led1.begin();
  led2.begin();
  led1.show(); // Initialize all pixels to 'off'
  led2.show();

}

void loop() {

  readButtonValues();
  changeColor();

  // Add delay
  delay(10);

}

void readButtonValues() {

  // read the state of the button values:
  MassiveButtonState1 = digitalRead(MassiveButtonPin1);
  MassiveButtonState2 = digitalRead(MassiveButtonPin2);
  MassiveButtonState3 = digitalRead(MassiveButtonPin3);
  MassiveButtonState4 = digitalRead(MassiveButtonPin4);

  RedButtonState1 = digitalRead(RedButtonPin1);
  RedButtonState2 = digitalRead(RedButtonPin2);
  RedButtonState3 = digitalRead(RedButtonPin3);
  RedButtonState4 = digitalRead(RedButtonPin4);

  WhiteButtonState1 = digitalRead(WhiteButtonPin1);

  // Print button state values to serial
  Serial.print(MassiveButtonState1);
  Serial.print(",");
  Serial.print(RedButtonState2);
  //Serial.print(MassiveButtonState2);
  Serial.print(",");
  Serial.print(MassiveButtonState3);
  Serial.print(",");
  Serial.print(MassiveButtonState4);
  Serial.print(",");

  Serial.print(RedButtonState1);
  Serial.print(",");
  Serial.print(MassiveButtonState2);
  //Serial.print(RedButtonState2);
  Serial.print(",");
  Serial.print(RedButtonState3);
  Serial.print(",");
  Serial.print(RedButtonState4);
  Serial.print(",");

  Serial.println(WhiteButtonState1);

}

void changeColor() {
  if (RedButtonState2 == 0 && MassiveButtonState2 == 0) {

    led1.setPixelColor(0, 255, 255, 1, 255);
    led2.setPixelColor(0, 255, 255, 1, 255);
    led1.show();
    led2.show();

  }

  if (RedButtonState2 == 0 && MassiveButtonState2 == 1) {

    //blue
    led1.setPixelColor(0, 51, 153, 255, 255);
    led2.setPixelColor(0, 0, 0, 0, 0);
    led1.show();
    led2.show();
  }

  if (RedButtonState2 == 1 && MassiveButtonState2 == 0) {

    //pink
    led1.setPixelColor(0, 0, 0, 0, 0);
    led2.setPixelColor(0, 255,0,136, 255); 
    led1.show();
    led2.show();

  }

  if (RedButtonState2 == 1 && MassiveButtonState2 == 1) {

    //yellow
    led1.setPixelColor(0, 117, 26, 255, 0);
    led2.setPixelColor(0, 117, 26, 255, 0);
    led1.show();
    led2.show();

  }

  

}
