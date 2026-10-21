import InfoIcon from '@mui/icons-material/Info';

export default function Info({ children }) {
    return (
        <span className="flex flex-row p-3 bg-da-peach border-2 border-da-navy rounded-2xl text-da-navy">
            <InfoIcon />
            <div className="pl-2">
                {children}
            </div>
        </span>
    )
}