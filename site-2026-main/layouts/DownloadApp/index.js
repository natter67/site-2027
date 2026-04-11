import React from 'react';

export default function DownloadApp() {
    return (
        // Add flex-col instead of justify-center if you're including the text
        <div className="flex flex-col md:flex-row items-center justify-center
                gap-10 mx-6 md:mx-auto md:w-3/4 text-sm">

            <div className="w-full md:w-2/5 lg:w-2/5
                            border p-6 rounded-lg 
                            text-center md:text-left">
                <p className="font-montserrat text-xl text-center">This year, we've introduced a new EOH 2026 iOS App! We highly reccomend using the app for live updates on all exhibits and special events, as well as to earn points by scanning the QR codes at different exhibits. For android users, you scan QR codes using the websites visitor-view page!</p>
                <a 
                    className="block w-fit mx-auto mt-4 rounded-md font-medium text-white px-8 py-4 text-base
                                bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600
                                hover:from-amber-300 hover:via-orange-400 hover:to-orange-500
                                transition-all duration-300 shadow-lg hover:shadow-xl"
                    href="https://apps.apple.com/us/app/eoh-2026/id6761497720"
                    target="_blank"
                    >
                    Download Here
                </a>
            </div>
        </div>
    );
}