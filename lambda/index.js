const Alexa = require('ask-sdk-core');
const i18n = require('i18next');

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {


    return handlerInput.responseBuilder
      .speak("Bienvenido a la skill, tu ambiente favorito. Dime el nombre de un ambiente para escuchar su sonido o pídeme ayuda.")
      .reprompt("Bienvenido a la skill, tu ambiente favorito. Dime el nombre de un ambiente o pídeme ayuda.")
      .getResponse();
  },
};

const EnvironmentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'EnvironmentIntent';
  },
  handle(handlerInput) {


    return handlerInput.responseBuilder
      .speak(environmentController(handlerInput))
      .reprompt(environmentController(handlerInput))
      .getResponse();
  },
};

function environmentController(handlerInput){
    
  const requestValue = handlerInput.requestEnvelope.request;
  const environmentValue = requestValue.intent.slots.environment.value;
  
  const textEnvironment = "Vas a escuchar el siguiente ambiente, "+environmentValue+". ";
  const soundEnvironment = "<audio src='https://app-sound.s3.eu-west-3.amazonaws.com/app-sound-envi/"+environmentValue+".mp3' />";
  const cont = "Di, no más ambientes para salir o di el nombre de otro ambiente para escuchar su sonido.";
  
  return textEnvironment+soundEnvironment+cont;
  
  
}



const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Esta es la lista de ambientes: aeropuerto, ciudad, comercio, construcción, fútbol, granja, jardín, lluvia, restaurante. Di un ambiente para escuchar su sonido.")
      .reprompt("Esta es la lista de ambientes: aeropuerto, ciudad, comercio, construcción, fútbol, granja, jardín, lluvia, restaurante. Di un ambiente para escuchar su sonido.")
      .getResponse();
  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Cerrando la skill, tu ambiente favorito, hasta pronto!")
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Cerrando la skill, tu ambiente favorito, hasta pronto!")
      .getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {

    return handlerInput.responseBuilder
      .speak("Error no se ha encontrado el ambiente. Dime el nombre de un ambiente o pídeme ayuda.")
      .reprompt("Error no se ha encontrado el ambiente. Dime el nombre de un ambiente o pídeme ayuda.")
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    EnvironmentHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('sample/basic-fact/v2')
  .lambda();
