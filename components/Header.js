import Head from 'next/head';
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Image, Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

const Header = ({ title = 'Welcome!' }) => {
	const { data: session, loading } = useSession();
	return (
		<>
		<Head>
			<meta name="description" content={title} />
			<title>Jazz Butcher - {title}</title>
		</Head>
		<div className="navbar navbar-fixed-top cbp-af-header-shrink">
			{!loading && <>
				{(session) ? (<>
					<NavDropdown className={'navItem'} title="" id="basic-nav-dropdown">
						<NavDropdown.Item href="/api/auth/signout">Sign Out</NavDropdown.Item>
					</NavDropdown>
				</>) : (<>
					<NavDropdown className={'navItem'} title="" id="basic-nav-dropdown">
						<NavDropdown.Item href="/api/auth/signin">Sign In</NavDropdown.Item>
					</NavDropdown>
				</>)
				}
				</>
			}
		</div>
		</>
	)
};

export default Header;
