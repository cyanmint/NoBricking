#!/bin/bash
# Script to create i18n documentation structure

cd webui/docs

# Create Docsify HTML with i18n support
cat > index.html << 'EOFHTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NoBricking Documentation</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="description" content="NoBricking module documentation">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
  <style>
    :root {
      --theme-color: #42b983;
      --theme-color-dark: #2c3e50;
    }
    .app-name-link img {
      width: 2rem;
    }
  </style>
</head>
<body>
  <div id="app">Loading...</div>
  <script>
    window.$docsify = {
      name: 'NoBricking',
      repo: 'cyanmint/NoBricking',
      loadSidebar: true,
      auto2top: true,
      subMaxLevel: 3,
      search: {
        paths: 'auto',
        placeholder: {
          '/zh-CN/': '搜索',
          '/': 'Search'
        },
        noData: {
          '/zh-CN/': '没有结果',
          '/': 'No results'
        }
      },
      fallbackLanguages: ['en'],
      alias: {
        '/.*/_sidebar.md': '/_sidebar.md',
        '/zh-CN/.*/_sidebar.md': '/zh-CN/_sidebar.md'
      }
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/docsify.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/zoom-image.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"></script>
</body>
</html>
EOFHTML

# Create English sidebar
cat > _sidebar.md << 'EOFSIDEBAR'
- Getting Started
  - [Overview](README.md)
  - [Changelog](CHANGELOG.md)

- Technical Docs
  - [Build Instructions](BUILD.md)
  - [Implementation](IMPLEMENTATION.md)
  - [Workflow](WORKFLOW.md)

- More
  - [Security](SECURITY.md)
  - [License](copying.txt)
EOFSIDEBAR

# Copy existing docs to create Chinese versions (simplified for script)
for file in CHANGELOG BUILD IMPLEMENTATION WORKFLOW SECURITY; do
  if [ ! -f "zh-CN/${file}.md" ]; then
    cp "${file}.md" "zh-CN/${file}.md" 2>/dev/null || echo "# ${file}" > "zh-CN/${file}.md"
  fi
done

# Copy license
cp copying.txt zh-CN/copying.txt 2>/dev/null || echo "GPLv3" > zh-CN/copying.txt

echo "i18n documentation structure created successfully!"
