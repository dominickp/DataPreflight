// Is invoked each time a new job arrives in one of the input folders for the flow element.
// The newly arrived job is passed as the second parameter.
function jobArrived( s : Switch, job : Job )
{
	var action = s.getPropertyValue('Action');
	var nodePath = s.getPropertyValue('NodeExecutablePath');
	var repositoryPath = s.getPropertyValue('RepositoryPath');
	var debug = s.getPropertyValue('Debug');
	var logLevel = 2;
		
	// cmd handling function
	var handleCmdResponse = function(Process, commandDescription, cmd){
		if(debug == 'Yes'){
			if(Process.stdout){
				s.log(logLevel, commandDescription + " response: "+Process.stdout);
			}
			if(Process.stderr){
				s.log(logLevel, commandDescription + " error: "+Process.stderr);
			}
			s.log(logLevel, "Command attempted: [" + cmd + "]");

		}
		if(!Process.stdout){
			s.log(3, commandDescription + " failed. " + Process.stderr);
			job.sendToData(3, job.getPath());
			return false;		
		} else {
			return true;
		}
	};
	
	// Test paths
	var testNode = function(nodePath){
		cmd = nodePath + " --version";
		Process.execute(cmd);
		return handleCmdResponse(Process, "Node --version verification", cmd);
	}(nodePath);

	var testRepo = function(nodePath, repositoryPath){
		cmd = nodePath + " " + repositoryPath + " --version";
		Process.execute(cmd);
		return handleCmdResponse(Process, "Repo --version verification", cmd);
	}(nodePath, repositoryPath);
	
	// Helper functions
	var quote = function(input){
		return '"' + input + '"';
	}
	
	// Actions
	if(action === "Preflight"){
		// Create a new job container
		preflightFilename = job.getNameProper()+"_preflight.txt";
		preflightJob = s.createNewJob(preflightFilename);
		fn = preflightJob.createPathWithName(preflightFilename, false);
		
		// Generate preflight
		cmd = nodePath + " " + repositoryPath + ' --action=preflight --input '+ quote(job.getPath()) +' --output ' + quote(fn);
		Process.execute(cmd);

		// Complete job
		job.sendToData(1, job.getPath());
		job.sendToLog(1, fn);
		
		handleCmdResponse(Process, "Preflight", cmd);
	};
}
  