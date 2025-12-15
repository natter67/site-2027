import Profile from '@/profile';
import Content from '@/content';

// const csv = require('csvtojson');
// const csvFilePath = "./pages/about-us/meet-the-committee/people.csv"

// csv()
//     .fromFile(csvFilePath)
//     .then((jsonArray) => {
//         const objectsList = jsonArray.map((row) => {
//             const object = {};
//             object["img"] = row["Name"].split(" ")[0].toLowerCase() + ".jpg";
//             for (const key in row) {
//                 object[key] = row[key];
//             }
//             return object;
//         });
//         console.log(objectsList);
//     });

const COMMITTEE_HEADSHOTS = [
{
    img: 'maddie.jpg',
    Name: 'Maddie Conrad',
    Position: 'Co-Director',
    Class: 'Senior',
    Major: 'Physics and French'
  },
  {
    img: 'aparna.jpg',
    Name: 'Aparna Kamath',
    Position: 'Co-Director',
    Class: 'Senior',
    Major: 'Physics'
  },
  {
    img: 'hiruni.jpg',
    Name: 'Hiruni Bopearatchy',
    Position: 'Secretary/Treasurer',
    Class: 'Junior',
    Major: 'Mechanical Engineering'
  },
  {
    img: 'ella.jpg',
    Name: 'Ella Greer',
    Position: 'Director of Facilities & Equipment',
    Class: 'Senior',
    Major: 'Aerospace Engineering'
  },
  {
    img: 'kate.jpg',
    Name: 'Kate Pactol',
    Position: 'Director of Exhibits',
    Class: 'Junior',
    Major: 'Mechanical Engineering'
  },
  {
    img: 'adithi.jpg',
    Name: 'Adithi Bikkavilli',
    Position: 'Director of Traffic & Safety',
    Class: 'Junior',
    Major: 'Computer Engineering'
  },
  {
    img: 'shiv.jpg',
    Name: 'Shivaditya Gohil',
    Position: 'Senior Corporate Director',
    Class: 'Graduate Student',
    Major: 'Computer Engineering'
  },
  {
    img: 'roshni.jpg',
    Name: 'Roshni Mathew',
    Position: 'Senior Corporate Director',
    Class: 'Senior',
    Major: 'Computer Engineering'
  },
  {
    img: 'archir.jpg',
    Name: 'Archir Luhana',
    Position: 'Junior Corporate Director',
    Class: 'Junior',
    Major: 'Electrical Engineering'
  },
  {
    img: 'shreya.jpg',
    Name: 'Shreya Gosavi',
    Position: 'Director of Special Events',
    Class: 'Junior',
    Major: 'Computer Science + Crop Sciences'
  },
  {
    img: 'manasi.jpg',
    Name: 'Manasi Bhargava',
    Position: 'Director of Special Events',
    Class: 'Junior',
    Major: 'Engineering Mechanics'
  },
  {
    img: 'ishani.jpg',
    Name: 'Ishani Patel',
    Position: 'Director of Marketing',
    Class: 'Senior',
    Major: 'Electrical Engineering'
  },
  {
    img: 'sarah.jpg',
    Name: 'Sarah Su',
    Position: 'Director of Marketing',
    Class: 'Sophomore',
    Major: 'Bioengineering'
  },
  {
    img: 'riya.jpeg',
    Name: 'Riya Karkhanis',
    Position: 'Director of Marketing',
    Class: 'Junior',
    Major: 'Computer Engineering'
  },
  {
    img: 'ved.jpg',
    Name: 'Ved Law',
    Position: "Visitor's Information Director",
    Class: 'Junior',
    Major: 'Bioengineering'
  },
  {
    img: 'lillian.jpeg',
    Name: 'Lillian Wang',
    Position: "Visitor's Information Director",
    Class: 'Sophomore',
    Major: 'Computer Science'
  },
  {
    img: 'alyssa.jpg',
    Name: 'Alyssa Huang',
    Position: 'Director of Judging and Awards',
    Class: 'Graduate Student',
    Major: 'Electrical Engineering'
  },
  {
    img: 'sydney.jpg',
    Name: 'Sydney Pavlik',
    Position: 'Middle School Design Competition Director',
    Class: 'Sophomore',
    Major: 'Materials Science and Engineering'
  },
  {
    img: 'aryaa.jpg',
    Name: 'Aryaa Rathi',
    Position: 'High School Design Competition Director',
    Class: 'Junior',
    Major: 'Computer Science'
  },
  {
    img: 'faraz.jpg',
    Name: 'Faraz Bhuiyan',
    Position: 'Startup Showcase Director',
    Class: 'Senior',
    Major: 'Mechanical Engineering'
  },
  {
    img: 'kushl.jpg',
    Name: 'Kushl Saboo',
    Position: 'Director of Advancements',
    Class: 'Senior',
    Major: 'Computer Engineering'
  },
  {
    img: 'divya.jpeg',
    Name: 'Divya Bendigeri',
    Position: 'Senior Director of Hospitality',
    Class: 'Senior',
    Major: 'Bioengineering'
  },
  {
    img: 'mohannad.jpg',
    Name: 'Mohannad Alghamdi',
    Position: 'Director of Hospitality',
    Class: 'Sophomore',
    Major: 'Materials Science and Engineering'
  },
  {
    img: 'shaan.jpg',
    Name: 'Shaan Doshi',
    Position: 'Senior Director of Technology',
    Class: 'Junior',
    Major: 'Computer Science and Physics'
  },
  {
    img: 'vani.jpg',
    Name: 'Vani Ramesh',
    Position: 'Junior Director of Technology',
    Class: 'Junior',
    Major: 'Computer Science'
  },
  {
    img: 'nathan.jpg',
    Name: 'Nathan Chan',
    Position: 'Junior Director of Technology',
    Class: 'Freshman',
    Major: 'Material Science and Engineering'
  },
  {
    img: 'tessa.jpg',
    Name: 'Tessa Waldhoff',
    Position: 'Director of Outreach',
    Class: 'Sophomore',
    Major: 'Bioengineering'
  },
  {
    img: 'brandon.jpg',
    Name: 'Brandon Kiene',
    Position: 'Junior Director of Outreach',
    Class: 'Freshman',
    Major: 'Engineering Mechanics'
  },
  {
    img: 'tushar.jpg',
    Name: 'Tushar Jain',
    Position: 'Junior Director of Outreach',
    Class: 'Senior',
    Major: 'Industrial Engineering'
  },
  {
    img: 'atsi.jpg',
    Name: 'Atsi Gupta',
    Position: 'Sustainability Director',
    Class: 'Senior',
    Major: 'Computer Engineering and ILEE'
  }
]

export default function MeetTheCommittee() {
  return (
    <div className="flex flex-row flex-wrap justify-center w-10/12 mx-auto">
      {COMMITTEE_HEADSHOTS.map((c) => (
        <Profile {...c} key={c.Name} />
      ))}
    </div>
  )
}
