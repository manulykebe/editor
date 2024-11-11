import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const WORKSPACE_DIR = './workspace';
const WORKFLOWS_DIR = './workflows';

app.use(cors());
app.use(express.json());

// Ensure directories exist
await fs.mkdir(WORKSPACE_DIR, { recursive: true });
await fs.mkdir(WORKFLOWS_DIR, { recursive: true });
await fs.mkdir(path.join(WORKSPACE_DIR, 'demo'), { recursive: true });

// Create initial demo files if they don't exist
const defaultFiles = {
  'test01.js': '// Demo file 1\nconsole.log("Hello from test01!");',
  'test02.js': '// Demo file 2\nconsole.log("Hello from test02!");'
};

for (const [filename, content] of Object.entries(defaultFiles)) {
  const filePath = path.join(WORKSPACE_DIR, 'demo', filename);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, content, 'utf-8');
  }
}

// File tree endpoints
async function buildFileTree(dir) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(WORKSPACE_DIR, fullPath);
    
    if (item.isDirectory()) {
      result.push({
        name: item.name,
        type: 'folder',
        path: '/' + relativePath,
        children: await buildFileTree(fullPath)
      });
    } else {
      result.push({
        name: item.name,
        type: 'file',
        path: '/' + relativePath
      });
    }
  }

  return result;
}

app.get('/api/files/tree', async (req, res) => {
  try {
    const tree = await buildFileTree(WORKSPACE_DIR);
    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Workflow endpoints
app.get('/api/workflows', async (req, res) => {
  try {
    const files = await fs.readdir(WORKFLOWS_DIR);
    const workflows = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(
          path.join(WORKFLOWS_DIR, file),
          'utf-8'
        );
        return JSON.parse(content);
      })
    );
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workflows/:id', async (req, res) => {
  try {
    const content = await fs.readFile(
      path.join(WORKFLOWS_DIR, `${req.params.id}.json`),
      'utf-8'
    );
    res.json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/workflows', async (req, res) => {
  try {
    const workflow = req.body;
    await fs.writeFile(
      path.join(WORKFLOWS_DIR, `${workflow.id}.json`),
      JSON.stringify(workflow, null, 2)
    );
    res.json({ message: 'Workflow saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/workflows/:id', async (req, res) => {
  try {
    await fs.unlink(path.join(WORKFLOWS_DIR, `${req.params.id}.json`));
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Existing file endpoints...
app.get('/api/files', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) throw new Error('Path is required');
    
    const fullPath = path.join(WORKSPACE_DIR, filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/files', async (req, res) => {
  try {
    const { path: itemPath, type, content = '' } = req.body;
    if (!itemPath || !type) throw new Error('Path and type are required');

    const fullPath = path.join(WORKSPACE_DIR, itemPath);
    
    if (type === 'folder') {
      await fs.mkdir(fullPath, { recursive: true });
    } else {
      await fs.writeFile(fullPath, content, 'utf-8');
    }
    
    res.json({ message: `${type} created successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/files', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    if (!filePath || content === undefined) throw new Error('Path and content are required');

    const fullPath = path.join(WORKSPACE_DIR, filePath);
    await fs.writeFile(fullPath, content, 'utf-8');
    res.json({ message: 'File updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/files', async (req, res) => {
  try {
    const { path: itemPath } = req.query;
    if (!itemPath) throw new Error('Path is required');

    const fullPath = path.join(WORKSPACE_DIR, itemPath);
    await fs.rm(fullPath, { recursive: true, force: true });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/files', async (req, res) => {
  try {
    const { oldPath, newPath } = req.body;
    if (!oldPath || !newPath) throw new Error('Old and new paths are required');
    
    const oldFullPath = path.join(WORKSPACE_DIR, oldPath);
    const newFullPath = path.join(WORKSPACE_DIR, newPath);
    
    await fs.rename(oldFullPath, newFullPath);
    res.json({ message: 'File renamed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});