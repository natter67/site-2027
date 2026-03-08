import React from 'react';

export default function Directors() {
    return (
        <div className="flex flex-col items-center gap-6 mx-6 md:mx-auto md:w-3/4 text-sm text-center md:text-justify">
        {/* Committee photo displayed above the directors' note */}
            <img 
                src="assets/images/committee-shot.jpg" 
                alt="Group picture of the EOH 2026 committee" 
                className='object-cover w-full max-w-3xl h-auto rounded-3xl' 
            />
            
            {/* Directors' note spans the width of the image */}
            <div className="w-full max-w-3xl border p-6 rounded-lg">
                <p className="mt-4">
                    Welcome to the 104th Engineering Open House (EOH) at the University of Illinois Urbana–Champaign! Whether this is your first visit or your tenth, we are incredibly excited to welcome you all to the nation’s largest student-run STEM (Science, Technology, Engineering, and Math) fair and to showcase how the Grainger College of Engineering is <b>Forging the Future</b>.                 </p>
                <p className="mt-2">
                    For EOH 2026, we chose the theme <b>Forging the Future</b> to highlight the central role that Grainger’s engineers hold in creating and shaping the technologies that will define tomorrow. With 210 exhibits, 19 special events, and 15 engineering startups, most of which were designed and built entirely by current students, we proudly display the creativity, innovation, and ambition of engineering students and faculty at UIUC. Through these efforts, we not only demonstrate the limitless possibilities within STEM, but also aim to inspire the next generation of engineers to imagine and build the future themselves.
                </p>
                <p className="mt-5">
                    Behind every exhibit, event, competition, and showcase at EOH stands a community of individuals whose efforts begin long before the doors open. From exhibitors and volunteers to corporate sponsors, faculty, staff, judges, alumni, and Grainger administration, this event is driven by hard work and a shared belief in the value of hands-on innovation and student leadership. The constant support of all of those involved strengthens a tradition that has inspired engineers for over a century.
                </p>
                <p className="mt-2">
                    At the heart of this weekend is the EOH Central Committee, composed of 29 student leaders who dedicate nearly a full year to transforming ideas into reality. Balancing coursework, research, internships, and personal commitments while leading an entirely student-run event of this scale is no small undertaking, and we thank our incredible committee for their true dedication and perseverance. Their organization, teamwork, and creativity are what make Engineering Open House not just possible, but exceptional.
                </p>
                <p className="mt-2">
                    This year, the EOH committee has worked tirelessly to implement novel ideas towards <b>Forging the Future</b> of EOH. 2026 marks the debut of the EOH mobile app, opening new pathways for visitors to engage with and experience our event. In addition, our Startup Showcase competition has grown larger than ever, promoting entrepreneurship in engineering through new collaborations with some of the most impactful Illinois startup success stories. With the introduction of EOH’s Research Showcase, we recognize the significant contributions to cutting-edge science and technology made by undergraduate researchers at Illinois. Finally, a new commitment to sustainability in materials and practices ensures that we forge thoughtfully, creating an event that will inspire scientists and engineers for generations to come.
                </p>
                <p className="mt-2">
                    We greatly appreciate each and every one of our visitors for their support year after year, from students, faculty, and community members here in Champaign–Urbana to those traveling from across the state and beyond. We’d also like to extend an additional warm welcome to those joining us for Mom’s Weekend and invite all guests to discover the unique events and experiences of EOH. As you explore, we encourage you to ask questions, stay curious, and immerse yourself in the innovation around you. We look forward to <b>Forging the Future</b> together.
                </p>
                <p className="mt-2">
                    Aparna Kamath & Maddie Conrad <br />
                    Co-Directors, Engineering Open House 2026
                </p>
            </div>
        </div>
    );
}
