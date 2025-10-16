"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const NodeMap = () => {
  const svgRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const blogTopics = [
  {
    id: 1,
    name: "About Me",
    radius: 60,
    content: {
      title: "Computer Science Student",
      description: "Currently studying and working on personal projects",
      date: "Present",
      readTime: "1 min read",
      category: "Personal",
      tags: ["Student", "Projects", "Development"],
      body: `
        <h2>Currently</h2>
        <p>I'm a Computer Science student focused on expanding my skills through personal projects and coursework.</p>
        
        <h2>Projects</h2>
        <p>Working on various development projects to apply theoretical knowledge in practical scenarios.</p>
        
        <h2>Skills</h2>
        <ul>
          <li>React, Next.js, JavaScript</li>
          <li>Node.js, Vue.js, Databases</li>
          <li>Java, Python, C</li>
        </ul>
      `,
    },
  },
  {
    id: 2,
    name: "?",
    radius: 55,
    content: {
      title: "?",
      description: "?",
      date: "October 16, 2025",
      readTime: "2 min read",
      category: "Career",
      tags: ["?"],
      body: `
        ?
      `,
    },
  }/*,
    {
      id: 3,
      name: "Next.js",
      radius: 50,
      content: {
        title: "Next.js 14: What's New and Exciting",
        description: "Exploring the latest features in Next.js 14",
        date: "January 10, 2024",
        readTime: "10 min read",
        category: "Framework",
        tags: ["Next.js", "React", "SSR"],
        body: `
          <h2>Server Components Revolution</h2>
          <p>Next.js 14 takes Server Components to the next level, enabling faster page loads and better SEO out of the box.</p>
          
          <h2>Improved Performance</h2>
          <p>The new Turbopack bundler shows significant improvements in development server startup time and hot reloads.</p>
          
          <h2>Enhanced Developer Experience</h2>
          <p>Better error messages, improved TypeScript support, and more intuitive APIs make development smoother than ever.</p>
          
          <h2>Real-World Benefits</h2>
          <p>In my projects, upgrading to Next.js 14 resulted in 40% faster build times and significantly better Core Web Vitals scores.</p>
        `,
      },
    },
    {
      id: 4,
      name: "CSS Magic",
      radius: 40,
      content: {
        title: "CSS Grid vs Flexbox: When to Use What",
        description: "A practical guide to choosing the right layout method",
        date: "January 8, 2024",
        readTime: "6 min read",
        category: "CSS",
        tags: ["CSS", "Layout", "Grid", "Flexbox"],
        body: `
          <h2>Understanding the Differences</h2>
          <p>CSS Grid is for two-dimensional layouts, while Flexbox is for one-dimensional layouts. Knowing when to use each is crucial.</p>
          
          <h2>Grid Use Cases</h2>
          <ul>
            <li>Complete page layouts</li>
            <li>Complex card grids</li>
            <li>Dashboard interfaces</li>
            <li>Any layout with both rows and columns</li>
          </ul>
          
          <h2>Flexbox Use Cases</h2>
          <ul>
            <li>Navigation bars</li>
            <li>Card components with flexible content</li>
            <li>Vertical or horizontal centering</li>
            <li>Distributing space within a container</li>
          </ul>
          
          <h2>Practical Example</h2>
          <p>Most modern layouts use both: Grid for the overall structure and Flexbox for the component internals.</p>
        `,
      },
    },
    {
      id: 5,
      name: "JavaScript",
      radius: 55,
      content: {
        title: "Modern JavaScript Patterns You Should Know",
        description:
          "Essential JavaScript patterns for clean and maintainable code",
        date: "January 5, 2024",
        readTime: "15 min read",
        category: "JavaScript",
        tags: ["JavaScript", "Patterns", "ES6+"],
        body: `
          <h2>Module Pattern</h2>
          <p>Using ES6 modules to organize code and maintain clean separation of concerns.</p>
          
          <h2>Factory Functions</h2>
          <p>Creating objects without the complexity of classes and inheritance chains.</p>
          
          <pre><code>function createUser(name, email) {
  return {
    name,
    email,
    login() {
      console.log(\`\${this.name} logged in\`);
    }
  };
}</code></pre>
          
          <h2>Observer Pattern</h2>
          <p>Implementing reactive programming patterns with custom event systems.</p>
          
          <h2>Async/Await Best Practices</h2>
          <p>Proper error handling and pattern for modern asynchronous JavaScript.</p>
        `,
      },
    },
  */];

  //
  const blogLinks = [
    { source: 1, target: 2 }
  ];

  useEffect(() => {
    setNodes(blogTopics);
    setLinks(blogLinks);
  }, []);

  const handleNodeClick = (blog) => {
    setSelectedBlog(blog);
    setShowPopup(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedBlog(null);
    document.body.style.overflow = "unset";
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  useEffect(() => {
    if (!nodes.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.radius + 10)
      )
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100)
      )
      .alphaDecay(0.02);

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#4a257bff")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const circle = node
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", "#9f86c0")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "#9f86c0")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        const connectedLinks = links.filter(
          (l) => l.source.id === d.id || l.target.id === d.id
        );
        const connectedNodeIds = new Set();
        connectedLinks.forEach((link) => {
          connectedNodeIds.add(link.source.id);
          connectedNodeIds.add(link.target.id);
        });

        node
          .select("circle")
          .attr("fill-opacity", (n) => (connectedNodeIds.has(n.id) ? 0.4 : 0.1))
          .attr("stroke-width", (n) => (connectedNodeIds.has(n.id) ? 3 : 2));

        link
          .attr("stroke-opacity", (l) =>
            l.source.id === d.id || l.target.id === d.id ? 1 : 0.2
          )
          .attr("stroke-width", (l) =>
            l.source.id === d.id || l.target.id === d.id ? 3 : 2
          );
      })
      .on("mouseout", function () {
        node.select("circle").attr("fill-opacity", 0.2).attr("stroke-width", 2);

        link.attr("stroke-opacity", 0.6).attr("stroke-width", 2);
      })
      .on("click", function (event, d) {
        event.stopPropagation();
        handleNodeClick(d);
      });

    const text = node
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "#9f86c0")
      .style("font-family", "'Permanent Marker', cursive")
      .style("font-size", (d) => Math.max(12, d.radius / 3))
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <svg ref={svgRef} className="w-full h-full cursor-move" />
      <div className="absolute top-4 left-4 text-sm text-[#9f86c0] opacity-70">
        Click on nodes to read blogs • Drag to interact
      </div>

      {showPopup && selectedBlog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-[#1a1a1a] border-2 border-[#9f86c0] rounded-lg w-full max-w-6xl h-[95vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-start p-6 border-b border-[#9f86c0] border-opacity-30">
              <div className="flex-1">
                <h2 className="text-4xl text-[#9f86c0] font-bold mb-2">
                  {selectedBlog.content.title}
                </h2>
                <p className="text-xl text-[#9f86c0] opacity-80 mb-4">
                  {selectedBlog.content.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[#9f86c0] opacity-80">
                  <span className="text-sm">{selectedBlog.content.date}</span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">
                    {selectedBlog.content.readTime}
                  </span>
                  <span className="text-sm">•</span>
                  <span className="text-sm bg-[#9f86c0] bg-opacity-20 px-2 py-1 rounded">
                    {selectedBlog.content.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedBlog.content.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs text-[#9f86c0] opacity-60 border border-[#9f86c0] border-opacity-40 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={closePopup}
                className="text-[#9f86c0] text-3xl hover:text-white transition-colors ml-4"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div
                className="prose prose-lg max-w-none text-[#9f86c0]"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content.body }}
                style={{
                  fontFamily: "'Permanent Marker', cursive",
                  lineHeight: "1.6",
                }}
              />

              <div className="border-t border-[#9f86c0] border-opacity-30 pt-6 mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-[#9f86c0] opacity-70">
                    <p>
                      Thanks for reading! Feel free to explore other topics.
                    </p>
                  </div>
                  <button
                    onClick={closePopup}
                    className="px-6 py-2 border-2 border-[#9f86c0] text-[#9f86c0] rounded hover:bg-[#9f86c0] hover:text-black transition-colors"
                  >
                    Close Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeMap;
