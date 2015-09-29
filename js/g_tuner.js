


window.addEventListener("load", initialize);
var correlation_worker = new Worker("correlation_worker.js");
correlation_worker.addEventListener("message", interpret_correlation_result);
console.log("inne i use_stream");

window.alert(halle);


//variable declarations
var fft_size = 2048;	
var frequency_buffer = new Float32Array(fft_size);


//initialize access to microphone 
function initialize(){

	var getMicrophone = navigator.getUserMedia;
	getMicrophone = getMicrophone || navigator. webkitGetUserMedia || navigator. mozGetUserMedia;
	//moz for firefox and webkit for crome and others 

	getMicrophone.call(navigator, {"audio": true}, use_stream, function() {});

	

}


//input parameter stream since it's the microphone
function use_stream (stream){

	
	var audio_context = new AudioContext();
	var mic = audio_context.createMediaStreamSource(stream);
	//creates a node with a mediastream representing the microphone 
	
	//creates an analyzer node
	var analyzer = audio_context.createAnalyzer();
	var gain_node = audio_context.createGain();

	gain_node.gain.value = 2;


	analyzer.fftSize = fft_size;

	mic.connect(analyzer);
	analyzer.connect(gain_node);
	gain_node.connect(audio_context.destination);





}

function interpret_correlation_result ( event ) {

	//reach timeseries (periods)
	var period = event.data.period;
	var frequency_amplitudes = event.data.frequency_amplitudes;
	var searchSize = fft_size*0.5;

	//fill up buffer with data from getFloatTimeDomain(the wave with values between one and minus one)
	analyzer.getFloatTimeDomainData(frequency_buffer);



	//compute the squared magnitudes of the comples amplitudes for each test freq. 
	var magnitudes = frequency_amplitudes.map(function(z){return z[0] * z[0] + z[1] * z[1]; })

}
