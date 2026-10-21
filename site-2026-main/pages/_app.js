import { Anton, Archivo, Doppio_One, JetBrains_Mono, Montserrat } from 'next/font/google';
import { Fragment } from "react";
import "tailwindcss/tailwind.css";
import BasicApp from "../layouts/BasicApp";
import { AuthProvider } from "../providers/Auth";
import "../styles/animations.css";
import "../styles/index.css";
import "../styles/direction-a.css";

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

const doppioOne = Doppio_One({
  weight: '400',
  variable: '--font-doppio',
  subsets: ['latin'],
})

// Direction A fonts. preload is off until a page uses them, so they cost nothing where unused.
const anton = Anton({
  weight: '400',
  variable: '--font-anton',
  subsets: ['latin'],
  preload: false,
})

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  preload: false,
})


function EOHApp(props) {
  return (
    <Fragment>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
      {/* <link
        href="https://fonts.googleapis.com/css2?family=Tourney:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Tourney:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      ></link>

      <link
      href="https://fonts.googleapis.com/css2?family=Lovelo:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      rel="stylesheet"
    ></link> */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      ></link>
      <main className={`${montserrat.variable} ${doppioOne.variable} ${anton.variable} ${archivo.variable} ${jetbrainsMono.variable} font-sans`}>
        <AuthProvider>
          <BasicApp {...props} />
        </AuthProvider>
      </main>
    </Fragment>
  );
}

export default EOHApp
