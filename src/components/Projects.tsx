import { useEffect, useRef, useState } from 'react';

type Project = {
    data: {
        name: string;
    };
};

const Projects = ({ projects }: { projects: Project[] }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(
        projects.length > 1 ? 1 : null
    );

    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (
            selectedIndex !== null &&
            containerRef.current &&
        itemRefs.current[selectedIndex]
        ) {
            const container = containerRef.current;
            const item = itemRefs.current[selectedIndex];

            if (item) {
                const containerHeight = container.clientHeight;
                const itemTop = item.offsetTop;
                const itemHeight = item.clientHeight;

                const scrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
                container.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth',
                });
            }
        }
    }, [selectedIndex]);

    return (
        <section ref={containerRef} className="h-[100vh] overflow-y-auto pt-[30vh] pb-[60vh] ml-20">
        {projects.map((project, index) => (
            <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => setSelectedIndex(index)}
            className={`project ${
                selectedIndex === index ? 'selected' : 'unselected'
            }`}
            >
            {project.data.name}
            </div>
        ))}
        </section>
    );
};

export default Projects;
