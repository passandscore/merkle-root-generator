const LINKS = [
  {
    url: "https://www.jasonschwarz.xyz/tools",
    title: "Tools",
  },
  {
    url: "https://www.jasonschwarz.xyz/projects",
    title: "Projects",
  },
  {
    url: "https://www.jasonschwarz.xyz/articles",
    title: "Articles",
  },
  {
    url: "https://www.jasonschwarz.xyz/about",
    title: "About",
  },
];

const Navbar = () => {
  const socialLinksNode = () => (
    <div className="flex items-center text-sm">
      <div className="space-x-1 mt-[2px]">
        <a
          href="https://github.com/passandscore"
          className="px-4 py-2 rounded-sm text-sm border border-transparent hover:bg-gray-900 focus:outline-none text-[#E2E8F0] font-raleway"
        >
          Github
        </a>
        <a
          href="https://www.linkedin.com/in/jason-schwarz-75b91482/"
          className="px-4 py-2 rounded-sm text-sm border border-transparent hover:bg-gray-900 focus:outline-none text-[#E2E8F0] font-raleway"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );

  const menuNode = () => (
    <div className="flex flex-wrap justify-center items-center space-x-5 ">
      {LINKS.map((link) => (
        <div key={link.url}>
          <a
            className="px-4 py-2 rounded-sm text-sm border border-transparent hover:bg-gray-900 focus:outline-none text-[#E2E8F0] font-raleway"
            href={link.url}
          >
            {link.title}
          </a>
        </div>
      ))}
      {socialLinksNode()}
    </div>
  );

  return (
    <>
      <div className="bg-[#4299E1] h-1 border-[#4299E1] mb-1" />
      <div className="bg-[#181A25]  border-[#4299E1]">
        <div className="mx-auto px-4">
          <div className="flex flex-col  md:flex-row md:justify-between md:items-center  py-4 space-y-4 md:space-y-0">
            <div className="flex justify-center md:justify-start items-center mb-4 md:mb-0">
              <a
                className="flex focus:outline-none hover:no-underline"
                href="https://www.jasonschwarz.xyz"
              >
                <div className="w-8 h-8 rounded-full mr-4 bg-white text-black flex justify-center items-center">
                  <span className="text-xl font-extrabold">J</span>
                </div>
              </a>
            </div>
            {menuNode()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
