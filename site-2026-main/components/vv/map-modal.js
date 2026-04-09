import { useState } from "react";

const useMapModal = () => {
    const [modalImages, setModalImages] = useState([]);
    const [noMapAvailable, setNoMapAvailable] = useState(false);

    const openModal = async (buildingCode) => {
        let images = [];

        if (buildingCode === "Sydney Lu") {
            images = [
              "/assets/maps/sidney-lu0.jpg",
              "/assets/maps/sidney-lu1.jpg",
              "/assets/maps/sidney-lu2.jpg",
            ];
            setNoMapAvailable(false);
        } else if (buildingCode === "Transporation Building") {
            images = [
              "/assets/maps/tb1.jpg",
              "/assets/maps/tb2.jpg",
            ];
            setNoMapAvailable(false);
        } else {
            const sanitized = buildingCode.toLowerCase().replace(/\s+/g, '-');
            const floor1Url = `/assets/maps/${sanitized}1.jpg`;
            const floor2Url = `/assets/maps/${sanitized}2.jpg`;
            try {
                const res1 = await fetch(floor1Url, { method: "HEAD" });
                if (res1.ok) {
                    try {
                        const res2 = await fetch(floor2Url, { method: "HEAD" });
                        images = res2.ok ? [floor1Url, floor2Url] : [floor1Url];
                    } catch {
                        images = [floor1Url];
                    }
                    setNoMapAvailable(false);
                } else {
                    setNoMapAvailable(true);
                    images = ["no-map"];
                }
            } catch {
                setNoMapAvailable(true);
                images = ["no-map"];
            }
        }

        setModalImages(images);
    };

    const closeModal = () => {
        setModalImages([]);
        setNoMapAvailable(false);
    };

    return { modalImages, noMapAvailable, openModal, closeModal };
};

export default useMapModal;