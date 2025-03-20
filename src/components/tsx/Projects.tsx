import { useEffect, useRef, useState, useCallback } from "react";

interface Project {
  data: {
    name: string;
  };
}

interface ProjectsComponentProps {
  projects: Project[];
}

/**
 * ProjectsComponent - A scrollable list of projects with keyboard navigation and modal view
 */
const ProjectsComponent = ({ projects }: ProjectsComponentProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Reset refs array when projects change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, projects.length);
  }, [projects.length]);

  // Find closest item to center when scrolling
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling) return;

    const container = containerRef.current;
    const containerTop = container.scrollTop;
    const containerCenter = containerTop + container.clientHeight / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((item, index) => {
      if (!item) return;

      const itemTop = item.offsetTop;
      const itemHeight = item.clientHeight;
      const itemCenter = itemTop + itemHeight / 2;

      const distance = Math.abs(itemCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setSelectedIndex(closestIndex);
  }, [isScrolling]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Smooth scroll to selected item
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

        const timer = setTimeout(() => setIsScrolling(false), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    console.log(e)
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "j") {
      setSelectedIndex((prev) => {
        const nextIndex = prev === null ? 0 : Math.min(prev + 1, projects.length - 1);
        return nextIndex;
      });
      e.preventDefault();
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "k") {
      setSelectedIndex((prev) => {
        const nextIndex = prev === null ? 0 : Math.max(prev - 1, 0);
        return nextIndex;
      });
      e.preventDefault();
    } else if (e.key === "Enter") {
      setIsModalOpen(true);
      e.preventDefault();
    } else if (e.key === "Escape" && isModalOpen) {
      setIsModalOpen(false);
      e.preventDefault();
    }
  }, [projects.length, isModalOpen]);

  // Attach keyboard listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Handle project click
  const handleClick = useCallback((index: number) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
    } else {
      setIsModalOpen(true);
    }
  }, [selectedIndex]);

  return (
    <section
      ref={containerRef}
      tabIndex={0} // Makes the container focusable so it can receive key events
      className="h-[90vh] overflow-y-auto py-[45vh] ml-20 snap-y snap-mandatory relative"
    >
      {selectedIndex === null ? <p>Click some project to activate keyword movement... [It also supports VIM motions]</p> : null}

      {projects.map((project, index) => (
        <div
          key={index}
          ref={(el) => (itemRefs.current[index] = el)}
          onClick={() => handleClick(index)}
          className={`project snap-center transition-all duration-300 ${
            selectedIndex === index ? "selected" : "unselected"
          }`}
        >
          {project.data.name}
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-end items-center modal-background">
          <div className="bg-[var(--light-gray)] rounded-2xl shadow-2xl overflow-hidden modal mr-40">
            <div className="bg-[var(--dark-gray)] flex items-center px-4 py-2">
              <div className="flex space-x-2">
                <button className="bg-red-500 w-4 h-4 rounded-full transition-colors duration-300 hover:bg-red-700" onClick={() => setIsModalOpen(false)}></button>
                <button className="bg-yellow-500 w-4 h-4 rounded-full transition-colors duration-300 hover:bg-yellow-700"></button>
                <button className="bg-green-500 w-4 h-4 rounded-full transition-colors duration-300 hover:bg-green-700"></button>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900">WHATEVER</h2>
              <p className="text-gray-700 mt-2 leading-relaxed">
                Something a bit larger, something a bit larger, something a bit larger, something a bit larger, something a bit larger.
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ProjectsComponent;
