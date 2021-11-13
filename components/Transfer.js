import { useEffect, useState } from 'react';
import axios from 'axios';

const Transfer = ({ who = 'MISSING', id = 'MISSING', value = '' }) => {
	const [ url, setURL ] = useState(value);
	const [ fName, setFName ] = useState();
	const [ fileType, setFileType ] = useState();
	const [ uploading, setUploading ] = useState();
	const [ uploadInput, setUploadInput ] = useState();
	const [ newURL, setNewURL ] = useState(false);
	const [ progress, setProgress ] = useState();

	console.log("WHO", who);

  const handleChange = (ev) => {
		console.log("EV", ev?.target?.value);
		const isUrl = (s) => {
			return s?.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);
		}
		setNewURL(false);
		if (isUrl(ev?.target?.value)) {
			setNewURL(true);
			setURL(ev?.target?.value);
		}
  }
  // Perform the upload
  const handleUpload = async (ev) => {
		ev.preventDefault();
		setUploading(true);
		setProgress('Transferring..');
    fetch(`/api/stream`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
				who,
				id,
				url,
			})
    })
		.then(e => e.json())
		.then(({ status, message }) => {
			setUploading();
			if (status !== 'success') {
				setProgress(message);
			} else {
				setNewURL(false);
				setProgress('Success!');
			}
		})
		.catch(e => {
				setUploading();
				console.log("ERROR", e);
        //alert("ERROR " + JSON.stringify(e));
		});
  }
  
	console.log(">>>>", url);
	return (
		<>
		<div className="App">
			<center>
				{!uploading &&
					<>
				Transfer single file from this URL: <input onChange={handleChange}
					name="url"
					ref={(ref) => { setUploadInput(ref); }}
					type="text" size="50" />
					</>
				}
				{(newURL && !uploading) &&
					<button onClick={handleUpload}>Transfer it!</button>
				}
			</center>
		</div>
		{(progress) && <div className="App">
			<center><div className="progress">{progress}</div></center>
		</div>}
		</>
	);
}

export default Transfer;
