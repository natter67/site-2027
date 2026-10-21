export default function Event({ description, title, color, icon, location, dateTime, link=null }) {
  var fullLink = "https://" + link
    return (
      <table
        className="font-body font-light text-black rounded-lg table-fixed w-7/8 h-52 lg:w-7/8 lg:h-30 mx-auto mb-5"
        style={{ backgroundColor: color }}
      >
        <thead className="">
            <tr>
              <th className="w-40"></th>
              <th className="pt-5 text-xl font-body">{title}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td className="ml-3">
                  {/* <img className="w-48 h-48 mx-auto lg:mr-10 mb-10" src={icon} alt="" />   */}
                </td>
                <td className="align-text-top pt-2">
                    <div className="italic">{location} <span className="text-theme-brown font-bold">{dateTime}<a href={fullLink} target="_blank" className="underline">{link}</a></span></div>
                    <div className="font-body table-cell align-middle px-2 text-left lg:text-lg">
                        {description}
                    </div>
                </td>
            </tr>
        </tbody>
        
      </table>
    );
  }
  