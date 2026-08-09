import React, { useRef, useEffect, useState } from "react";
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import Transfer from '../components/Transfer';

export async function getServerSideProps({ req, res }) {
	const session = { user: { email: 'open' } };
	//console.log("SESSION", session);
  return {
    props: {
			session,
		},
  }
}

const App = ({ session }) => {
	const [ who, setWho ] = useState('');
	const [ value, setValue ] = useState();
	const [ url, setURL ] = useState();
	const [ type, setType ] = useState('upload');
	const [ image, setImage ] = useState('');

	return (
		<Layout title="Uploader">
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			<div className="App">
				<center>
				<b>Credit this upload to...?</b> <input type="text" name="who" length={20} onChange={(ev) => setWho(ev?.target?.value)} />
				<p />
				{/*!!(who?.length) &&
				<select name="type" value={type} onChange={(ev) => setType(ev?.target?.value)} >
					<option value='' >-- Choose upload type --</option>
					<option value='upload'>I have a local file to upload</option>
					<option value='transfer'>There's an online file to transfer</option>
				</select>
				*/}
				</center>
				{!!(type === 'upload' && who?.length) && <Uploader who={who} />}
				{!!(type === 'transfer' && who?.length) && <Transfer who={who} />}

				<div>
					<hr/>
					<b>Instructions:</b>
					<ol>
					{(!who?.length) && <li>Enter your name/Who to credit</li>}
					{(!type) && <li>Choose the type of upload</li>}
					{(type === 'upload') && <li>In the middle box: Select a local file</li>}
					{(type === 'upload') && <li>Press 'upload it!'</li>}
					{(type === 'transfer') && <li>In the middle box: Enter the URL of the file to transfer.</li>}
					{(type === 'transfer') && <li>Press 'Transfer it!'</li>}
					</ol>
					{(!!type) && <i>Know that you've done good in the world.</i>}
				</div>
			</div>
		</Layout>   
	)
}

export default App;
