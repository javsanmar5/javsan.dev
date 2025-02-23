import { useEffect, useRef, useState } from "react";

type Project = {
  data: {
    name: string;
  };
};

const Projects = ({ projects }: { projects: Project[] }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll handler to determine the closest item to the center
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

  // Smooth scrolling effect when the selected index changes
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

        setTimeout(() => setIsScrolling(false), 250);
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        // If no selection, default to 0; otherwise, move to the next item (if possible)
        setSelectedIndex((prev) => {
          const nextIndex = prev === null ? 0 : Math.min(prev + 1, projects.length - 1);
          return nextIndex;
        });
        e.preventDefault(); // Prevent default scrolling behavior
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => {
          const nextIndex = prev === null ? 0 : Math.max(prev - 1, 0);
          return nextIndex;
        });
        e.preventDefault();
      }
    };

    // Add event listener on the container
    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [projects.length]);

  return (
    <section
      ref={containerRef}
      tabIndex={0} // Makes the container focusable so it can receive key events
      className="h-[90vh] overflow-y-auto py-[45vh] ml-20 snap-y snap-mandatory relative"
    >
    {selectedIndex === null ? <p>Click some project or scroll to activate keyword movement...</p>: null}

      {projects.map((project, index) => (
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          onClick={() => setSelectedIndex(index)}
          className={`project snap-center transition-all duration-300 ${
            selectedIndex === index ? "selected" : "unselected"
          }`}
        >
          {project.data.name}
        </div>
      ))}
    </section>
  );
};

export default Projects;
