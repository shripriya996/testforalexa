/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const https = require('https');

 var message = `Harry felt happier for the rest of the weekend than he had done all term. He and Ron spent much of Sunday catching up with all their homework again, and although this could hardly be called fun, the last burst of autumn sunshine persisted, so rather than sitting hunched over tables in the common room they took their work outside and lounged in the shade of a large beech tree on the edge of the lake. Hermione, who of course was up to date with all her work, brought more wool outside with her and bewitched her knitting needles so that they flashed and clicked in midair beside her, producing more hats and scarves.`
 //["Lorem Ipsum is simply dummy text of the printing and typesetting industry.", "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", "when an unknown printer took a galley of type and scrambled it to make a type specimen book"];
 var texts = message.split('.');
 var index = 0;
 var isContinous = false;
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   async handle(handlerInput) {
        // const speakOutput = 'Welcome, you can say Read with me to read a book. Would you like to try?';

        // return handlerInput.responseBuilder
        //     .speak(speakOutput)
        //     .reprompt(speakOutput)
        //     .getResponse();
          console.log(">>>>>>>>TEST LOG1");
        let http_promise = getPromise();
		let response_body = await http_promise;
    console.log(">>>>>>>>TEST LOG2");
    var result = JSON.parse(response_body);
     console.log(">>>>>>>>TEST LOG3"+response_body);
        message = result.Item.content;
        texts = message.split('.');
        index = 0;
        const speakOutput = '';
        makeResponse(handlerInput,texts[index]);
        isContinous = true;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';


        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};



const readwithmeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'readwithmeIntent';
    },
    async handle(handlerInput) {
        console.log(">>>>>>>>TEST LOG1");
        let http_promise = getPromise();
		let response_body = await http_promise;
    console.log(">>>>>>>>TEST LOG2");
    var result = JSON.parse(response_body);
     console.log(">>>>>>>>TEST LOG3"+response_body);
        message = result.Item.content;
        texts = message.split('.');
        index = 0;
        const speakOutput = '';
        makeResponse(handlerInput,texts[index]);
        isContinous = true;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};



// function returns a Promise
function getPromise() {
	return new Promise((resolve, reject) => {
		https.get('https://1ul9s2vuae.execute-api.us-east-1.amazonaws.com/content/7', (response) => {
			let chunks_of_data = [];

			response.on('data', (fragments) => {
				chunks_of_data.push(fragments);
			});

			response.on('end', () => {
				let response_body = Buffer.concat(chunks_of_data);
				resolve(response_body.toString());
			});

			response.on('error', (error) => {
				reject(error);
			});
		});
	});
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
};

const PauseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PauseIntent';
    },
    handle(handlerInput) {
         if(!isContinous)
        {
            const speakOutput = ' Nothing to pause. you can say Read with me to read a book. Would you like to try?';
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        else{
        isContinous = false;
        const speakOutput = '';
        makeResponse(handlerInput,"Ok Paused");
        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
    }
};


const ResumeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ResumeIntent';
    },
    handle(handlerInput) {
        if(!isContinous)
        {
            const speakOutput = ' Nothing to resume. you can say Read with me to read a book. Would you like to try?';
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        else{
         isContinous = true;
        const speakOutput = 'Ok. Resuming';
        makeResponse(handlerInput,texts[index]);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
    }
    }
};

const UserEventHandler = {
    canHandle(handlerInput) {
        return true;
       // return Alexa.getRequestType(handlerInput.requestEnvelope)  === 'Alexa.Presentation.APL.UserEvent';
    },
    handle(handlerInput) {
        if(index >= texts.length ){
            const speakOutput = 'Reached the end of Reading';
             return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
        }else if(!isContinous){
            const speakOutput = '';
             return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
        }
        else{
             index++;
             if(index >= texts.length ){
                const speakOutput = 'Reached the end of Reading';
                 return handlerInput.responseBuilder
                        .speak(speakOutput)
                        .getResponse();
        }
              const speakOutput = '';
                 makeResponse(handlerInput,texts[index]);
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
        }
    }
    
};

function makeResponse(handlerInput, textToRead){
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
    console.log("The user's device supports APL");

    const documentName = "ReadSkill"; // Name of the document saved in the authoring tool
    const token = documentName + "Token";
    
    // Add the RenderDocument directive to the response
    handlerInput.responseBuilder.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        token: token,
        document: {
            src: 'doc://alexa/apl/documents/' + documentName,
            type: 'Link'
        },
        datasources: {
    "BookContentDataSource": {
        
        "type": "object",
        "properties": {
            "pageIndex": "0",
            "cardTitle": "My book",
            "bookTextZero": textToRead,
            "bookTextOne": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            "bookSpeechSSMLZero": "<speak>"+textToRead+"</speak>",
            "bookSpeechSSMLOne": "<speak>Lorem Ipsum is s</speak>"
        },
        "transformers": [
            {
                "inputPath": "bookSpeechSSMLZero",
                "outputName": "bookInfoSpeechZero",
                "transformer": "ssmlToSpeech"
            },
            {
                "inputPath": "bookSpeechSSMLZero",
                "outputName": "bookTextZero",
                "transformer": "ssmlToText"
            },
            {
                "inputPath": "bookSpeechSSMLOne",
                "outputName": "bookInfoSpeechOne",
                "transformer": "ssmlToSpeech"
            },
            {
                "inputPath": "bookSpeechSSMLOne",
                "outputName": "bookTextOne",
                "transformer": "ssmlToText"
            }
        ]
    }
}
    });
} else {
    // Just log the fact that the device doesn't support APL.
    // In a real skill, you might provide different speech to the user.
    console.log("The user's device doesn't support APL. Retest on a device with a screen")
}
return;
}


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        
        isContinous = false;
        const speakOutput = '';
        makeResponse(handlerInput,"Goodbye");
        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .reprompt(speakOutput)
            .getResponse();
        
        // isContinous = false;
        // const speakOutput = 'Goodbye!';

        // return handlerInput.responseBuilder
        //     .speak(speakOutput)
        //     .getResponse();
    }
    
};


/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        readwithmeIntentHandler,
        PauseIntentHandler,
        ResumeIntentHandler,
        UserEventHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();