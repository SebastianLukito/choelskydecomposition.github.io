function generateMatrix() {
  const rows = parseInt(document.getElementById('rows').value);
  const columns = parseInt(document.getElementById('columns').value);

  if (isNaN(rows) || isNaN(columns) || rows <= 0 || columns <= 0) {
      alert('Please enter valid rows and columns.');
      return;
  }

  const matrixInputHtml = createMatrixTable(rows, columns);
  document.getElementById('matrixInput').innerHTML = matrixInputHtml;
  matrixInput.innerHTML = matrixInputHtml;

  // Show the Cholesky Decomposition button
  document.getElementById('choleskyButton').style.display = 'block';

  // Scroll to the matrix input section
  matrixInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createMatrixTable(rows, columns, matrix = []) {
  let matrixTableHtml = '<label for="matrix">Matrix:</label>';
  matrixTableHtml += '<table id="matrixTable">';

  for (let i = 0; i < rows; i++) {
      matrixTableHtml += '<tr>';
      for (let j = 0; j < columns; j++) {
          let value = matrix[i] && matrix[i][j] ? matrix[i][j] : '';
          matrixTableHtml += `<td><input type="number" id="matrix${i}_${j}" value="${value}" placeholder="(${i + 1},${j + 1})"></td>`;
      }
      matrixTableHtml += '</tr>';
  }

  matrixTableHtml += '</table>';
  return matrixTableHtml;
}

function generateSymmetricPositiveDefiniteMatrix() {
  const size = parseInt(document.getElementById('rows').value);
  if (isNaN(size) || size <= 0) {
      alert('Please enter a valid matrix size.');
      return;
  }

  // Update the columns field to match the rows
  document.getElementById('columns').value = size;

  // Generate a random symmetric matrix
  let matrix = [];
  for (let i = 0; i < size; i++) {
      matrix[i] = new Array(size).fill(0);
      for (let j = 0; j <= i; j++) {
          const value = Math.floor(Math.random() * 10) + 1; // +1 to avoid zero
          matrix[i][j] = value;
          matrix[j][i] = value; // Symmetry
      }
  }

  // Modify the diagonal to ensure positive definiteness
  for (let i = 0; i < size; i++) {
      let sum = 0;
      for (let j = 0; j < size; j++) {
          if (i != j) {
              sum += Math.abs(matrix[i][j]);
          }
      }
      matrix[i][i] = sum + 1; // Diagonal element > sum of absolute values of non-diagonal elements in the row
  }

  // Display the generated matrix
  const matrixInputHtml = createMatrixTable(size, size, matrix);
  document.getElementById('matrixInput').innerHTML = matrixInputHtml;

  // Show the Cholesky Decomposition button
  document.getElementById('choleskyButton').style.display = 'block';
}

  function choleskyDecomposition() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
  
    // Retrieve matrix elements from user input
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns; j++) {
        matrix[i][j] = parseFloat(document.getElementById(`matrix${i}_${j}`).value);
      }
    }
  
    // Validate the matrix for Cholesky decomposition
    if (!isSymmetricPositiveDefinite(matrix)) {
      alert('Please enter a valid symmetric positive definite matrix.');
      return;
    }
  
    // Perform Cholesky decomposition
    const resultMatrix = choleskyDecompose(matrix);
  
    // Display the result
    displayCholeskyResult(resultMatrix);
  }
  
  function displayCholeskyResult(resultMatrix) {
    const transpose = transposeMatrix(resultMatrix);
    let resultHtml = '<h3>Cholesky Decomposition Result:</h3>';
    
    resultHtml += '<div class="matrix-display">';
    resultHtml += '<div><p>Lower Triangular Matrix (L):</p>';
    resultHtml += matrixToHtmlTable(resultMatrix) + '</div>';

    resultHtml += '<div><p>Transpose of Lower Triangular Matrix (L<sup>T</sup>):</p>';
    resultHtml += matrixToHtmlTable(transpose) + '</div>';
    resultHtml += '</div>';

    document.getElementById('result').innerHTML = resultHtml;
  }
  
  function isSymmetricPositiveDefinite(matrix) {
    // Check if the matrix is symmetric
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < i; j++) {
        if (matrix[i][j] !== matrix[j][i]) {
          return false;
        }
      }
    }
  
    // Check if the matrix is positive definite
    for (let i = 0; i < matrix.length; i++) {
      if (det(matrix.slice(0, i + 1).map(row => row.slice(0, i + 1))) <= 0) {
        return false;
      }
    }
  
    return true;
  }
  
  function choleskyDecompose(matrix) {
    const n = matrix.length;
    const resultMatrix = new Array(n).fill().map(() => new Array(n).fill(0));
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += resultMatrix[i][k] * resultMatrix[j][k];
        }
  
        if (i === j) {
          resultMatrix[i][j] = Math.sqrt(matrix[i][i] - sum);
        } else {
          resultMatrix[i][j] = (matrix[i][j] - sum) / resultMatrix[j][j];
        }
      }
    }
  
    return resultMatrix;
  }
  
  function det(matrix) {
    const n = matrix.length;
    if (n === 1) {
      return matrix[0][0];
    }
  
    let determinant = 0;
    for (let i = 0; i < n; i++) {
      determinant += matrix[0][i] * cofactor(matrix, 0, i);
    }
  
    return determinant;
  }
  
  function cofactor(matrix, row, col) {
    return Math.pow(-1, row + col) * det(minor(matrix, row, col));
  }
  
  function minor(matrix, row, col) {
    return matrix.filter((_, i) => i !== row).map(row => row.filter((_, j) => j !== col));
  }

function matrixToHtmlTable(matrix) {
  let html = '<table border="1">';
  for (let i = 0; i < matrix.length; i++) {
      html += '<tr>';
      for (let j = 0; j < matrix[i].length; j++) {
          html += `<td>${matrix[i][j].toFixed(4)}</td>`;
      }
      html += '</tr>';
  }
  html += '</table>';
  return html;
}

function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}
  
  document.getElementById('rows').addEventListener('change', function() {
    document.getElementById('choleskyButton').style.display = 'none';
});

  document.getElementById('columns').addEventListener('change', function() {
    document.getElementById('choleskyButton').style.display = 'none';
});
