import Head from 'next/head';
import Link from 'next/link'
import { useSession } from 'next-auth/client'

import { Image, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Header = ({ title = 'Welcome!' }) => {
	const [ session, loading ] = useSession();
	return (
		<>
		<Head>
			<meta name="description" content={title} />
			<title>Jazz Butcher - {title}</title>
		</Head>
		<div className="navbar navbar-fixed-top cbp-af-header-shrink">
			{!loading && <>
				{session && <>
					{!session.user.image &&
						<Link href="/account">
							<span style={{backgroundImage: `url('/images/avatar.png')` }} className={'avatar'}/>
						</Link>
					}
					<NavDropdown className={'navItem'} title="" id="basic-nav-dropdown">
						<NavDropdown.Item href="/api/auth/signout">Sign Out</NavDropdown.Item>
					</NavDropdown>
				</> }
				{!session && <>
					<Link href="/api/auth/signin">
						<span style={{backgroundImage: `url('/images/avatar.png')` }} className={'avatar'}/>
					</Link>
					<NavDropdown className={'navItem'} title="" id="basic-nav-dropdown">
						<NavDropdown.Item href="/api/auth/signin">Sign In</NavDropdown.Item>
					</NavDropdown>
				</>}
				</>
			}
		</div>
		</>
	)
};

export default Header;
