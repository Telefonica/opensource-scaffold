const DICTIONARIES_BASE_PATH = "tools/cspell";

module.exports = {
  // Version of the setting file.  Always 0.2
  version: "0.2",
  // Paths to be ignored
  ignorePaths: [
    "node_modules/**",
    ".husky/**",
    "pnpm-lock.yaml",
    "tools/cspell/*.txt",
    "cspell.config.cjs",
    "**/.gitignore",
  ],
  caseSensitive: false,
  // Language - current active spelling language
  language: "en",
  // Dictionaries to be used
  dictionaryDefinitions: [
    { name: "node-custom", path: `${DICTIONARIES_BASE_PATH}/node.txt` },
    { name: "missing-en", path: `${DICTIONARIES_BASE_PATH}/missing-en.txt` },
    { name: "people", path: `${DICTIONARIES_BASE_PATH}/people.txt` },
    { name: "tech", path: `${DICTIONARIES_BASE_PATH}/tech.txt` },
  ],
  dictionaries: ["node-custom", "missing-en", "people", "tech"],
  // The minimum length of a word before it is checked.
  minWordLength: 4,
  // flagWords - list of words to be always considered incorrect. This is useful for offensive words and common spelling errors. For example "hte" should be "the"
  flagWords: ["hte"],
};
