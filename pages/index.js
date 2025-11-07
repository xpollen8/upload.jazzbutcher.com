import React, { useRef, useEffect, useState } from "react";
import { signIn, signOut, getSession } from 'next-auth/react'
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import Transfer from '../components/Transfer';

export async function getServerSideProps({ req, res }) {
	//const session = (await getSession({ req })) || process.env.NEXTAUTH_URL === 'http://localhost:3000';
	const session = { user: { email: 'open' } };
	console.log("SESSION", session);
	const issues = await fetch('https://api.github.com/search/issues?q=repo:xpollen8/jazzbutcher.com+type:issue+state:open&sort=asc')
		.then(r => r.json())
		.then(r => r?.items?.map(({ title, number }) => {
			const truncAt = 40;
			return {
				number,
				title: (title?.length > truncAt) ? `${title.substr(0, truncAt)}...` : title }
		}));
  return {
    props: {
			session,
			issues,
		},
  }
}

const App = ({ session, issues }) => {
	const [ id, setId ] = useState(666);
	const [ value, setValue ] = useState();
	const [ url, setURL ] = useState();
	const [ type, setType ] = useState();
	const [ image, setImage ] = useState('');

	return (
		<Layout title="Uploader">
			<noscript>
				<style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
			</noscript>
			{(session) ?  (
				<div className="App">
					{/*
					<b>Github Issue</b>:
					<select name="id" value={id} onChange={(ev) => setId(ev?.target?.value)} >
					<option value={666} >-- SOMETHING NOT LISTED BELOW --</option>
					{issues.map(({ number, title }) => (<option key={number} value={number}>#{number}: {title}</option>))}
					</select>
					<br/>
					*/}
					<center>
					<select name="type" value={type} onChange={(ev) => setType(ev?.target?.value)} >
						<option value='' >-- Choose upload type --</option>
						<option value='upload'>I have a local file to upload</option>
						<option value='transfer'>There's an online file to transfer</option>
					</select>
					</center>
					{!!(type === 'upload' && id && parseInt(id, 10) > 0) && <Uploader who={session?.user?.email} id={id} />}
					{!!(type === 'transfer' && id && parseInt(id, 10) > 0) && <Transfer who={session?.user?.email} id={id} />}

					<div>
						<hr/>
						<b>Instructions:</b>
						<ol>
						{(parseInt(id, 10) == 0) && <li>Select the Github issue from those available.</li>}
						{(!type) && <li>Choose the type of upload</li>}
						{(type === 'upload') && <li>In the middle box: Select a local file</li>}
						{(type === 'upload') && <li>Press 'upload it!'</li>}
						{/*(type === 'upload') && <li>Move the github Issue to <i>Done</i> state</li>*/}
						{(type === 'transfer') && <li>In the middle box: Enter the URL of the file to transfer.</li>}
						{(type === 'transfer') && <li>Press 'Transfer it!'</li>}
						{/*(type === 'transfer') && <li>Move the github Issue to <i>Done</i> state</li>*/}
						</ol>
						{(!!type) && <i>Know that you've done good in the world.</i>}
					</div>
				</div>
			) : (
				<>
					<span className={'notSignedInText'}>You are not signed in</span>
					<a
							href={`/api/auth/signin`}
							className={'buttonPrimary'}
							onClick={(e) => {
								e.preventDefault()
								signIn()
							}}
						>
						Sign in
					</a>
				</>
			)
			}
		</Layout>   
	)
}

export default App;
