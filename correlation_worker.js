self.onmessage = function(event)
{
	console.log("inne i on_message");
	var timeseries = event.data.timeseries; //buffern med vågdatat
	//console.log(timeseries);
	var test_frequencies = event.data.test_frequencies; //testfrekvenserna just under, note, just over
	var sample_rate = event.data.sample_rate; //AudioContext samplar med 48000Hz
	var amplitudes = compute_correlations(timeseries, test_frequencies, sample_rate); //en array med objekt enligt [re, im], får värdena från funktionen compute_correlation
	self.postMessage({ "timeseries": timeseries, "frequency_amplitudes": amplitudes }); //startar .addEventListner(.. interpret_cor...)

	//console.log(amplitudes);
};

function compute_correlations(timeseries, test_frequencies, sample_rate)
{
	console.log("inne i compute_correlations");
	// 2pi * frequency(frequency = 1/samplerate då eller?) gives the appropriate period to sine.
	// timeseries index / sample_rate gives the appropriate time coordinate.

	//lite teori-jox: sum(micljud(t)*sin(2*pi*testfrekvens*t)) = sort tal om micljud(t) och
	//testfrekvens-sinusvågen är väldigt lika. i function f så räknar vi med både en sin 
	//funktion och en cos funktion enligt e^(ix) = cos x + i sin x


	var scale_factor = 2 * Math.PI / sample_rate;
	var amplitudes = test_frequencies.map //för varje testfrekvens så körs funktionen f som räknar ut amplituden (hur likt mic-ljudet är) som en real-del och en imaginärdel
	(
		function(f)
		{
			var frequency = f.frequency;

			// Represent a complex number as a length-2 array [ real, imaginary ].

			//"The most elementary use for an accumulator is adding a sequence of numbers. 
			//The numerical value in the accumulator increases as each number is added." fast dessa beräkningar kommer
			//senare, just nu spara vi bara värdena i en amplitude-array
			var accumulator = [ 0, 0 ]; 
			for (var t = 0; t < timeseries.length; t++)
			{
				accumulator[0] += timeseries[t] * Math.cos(scale_factor * frequency * t); //realdelen
				accumulator[1] += timeseries[t] * Math.sin(scale_factor * frequency * t); //imaginärdelen
			}

			return accumulator;
		}
	);

	return amplitudes;
}
