function importscriptpreprocessing(content) {
	Mojo.Log.info("ImportScript Start");
	var result = "";

	
	
	var tmpContent = content.split(unescape('%0D%0A'));
	
	tmpContent = tmpContent.join("");
	
	var tmpContent = content.split('\n');
	
	for(var i=0; i < tmpContent.length-1; i++) {
		var tmpContent2 = tmpContent[i].split(";");
		result = result + tmpContent2[17] + ";DHL;" + tmpContent2[1] + "\n";
	}
	
	Mojo.Log.info("ImportScript End");
	
	//return("bla;DHL;12345\nblubb;Hermes;54321\n")
	return result;
}
