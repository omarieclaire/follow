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

}

void loop() {

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
  Serial.print(MassiveButtonState2);
  Serial.print(",");
  Serial.print(MassiveButtonState3);
  Serial.print(",");
  Serial.print(MassiveButtonState4);
  Serial.print(",");

  Serial.print(RedButtonState1);
  Serial.print(",");
  Serial.print(RedButtonState2);
  Serial.print(",");
  Serial.print(RedButtonState3);
  Serial.print(",");
  Serial.print(RedButtonState4);
  Serial.print(",");

  Serial.println(WhiteButtonState1);

  // Add delay
  delay(10);

}
