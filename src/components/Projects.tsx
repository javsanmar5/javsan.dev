import { useEffect, useRef, useState } from "react";

type Project = {
    data: {
        name: string;
    };
};

const Projects = ({ projects }: { projects: Project[] }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isScrolling, setIsScrolling] = useState(false); // Track manual scrolling
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || isScrolling) return;

            const container = containerRef.current;
            const containerCenter = container.scrollTop + container.clientHeight / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            itemRefs.current.forEach((item, index) => {
                if (!item) return;

                const itemCenter = item.offsetTop + item.clientHeight / 2;
                const distance = Math.abs(containerCenter - itemCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            setSelectedIndex(closestIndex);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [isScrolling]);

    useEffect(() => {
        if (
            selectedIndex !== null &&
            containerRef.current &&
        itemRefs.current[selectedIndex]
        ) {
            setIsScrolling(true);  

            const container = containerRef.current;
            const item = itemRefs.current[selectedIndex];

            if (item) {
                const containerHeight = container.clientHeight;
                const itemTop = item.offsetTop;
                const itemHeight = item.clientHeight;

                const scrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
                container.scrollTo({
                    top: scrollTop,
                    behavior: "smooth",
                });

                setTimeout(() => setIsScrolling(false), 500);
            }
        }
    }, [selectedIndex]);

    return (
        <section
        ref={containerRef}
        className="h-[100vh] overflow-y-auto py-[45vh] ml-20 snap-y snap-mandatory relative"
        >
        {projects.map((project, index) => (
            <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => setSelectedIndex(index)}
            className={`project snap-center transition-all duration-300 ${
                selectedIndex === index
                    ? "selected "
                    : "unselected "
            }`}
            >
            {project.data.name}
            </div>
        ))}
        </section>
    );
};

export default Projects;
