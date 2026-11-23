# Model Documentation — ORBIT Implicit Matrix Factorization (ALS)

## 1. Problem Formulation
ORBIT solves **Personalized Product Recommendation** for an online gift retailer using **Implicit Collaborative Filtering** via **Alternating Least Squares (ALS)** (`implicit.als.AlternatingLeastSquares`, `implicit==0.7.3`).

Given the sparse customer–product interaction matrix $R \in \mathbb{R}^{m \times n}$ (`3,751 × 3,049`, `98.07%` sparse), matrix factorization learns two dense low-rank matrices:
- **Customer latent factors:** $U \in \mathbb{R}^{m \times k}$
- **Product latent factors:** $V \in \mathbb{R}^{n \times k}$

such that $R \approx U \times V^\top$, and personalized affinity scores are computed by the inner product $\hat{r}_{ui} = u_u^\top v_i$.

## 2. Mathematical Objective (Hu, Koren & Volinsky, 2008)
Implicit purchase logs provide positive confidence signals, not explicit dislikes:
- Binary preference indicator: $p_{ui} = 1$ if customer $u$ purchased product $i$ in training, else $0$.
- Confidence weight: $C_{ui} = 1 + \alpha \cdot r_{ui}$, where $r_{ui} = \ln(1 + \text{invoices}_{ui})$.
- Regularized loss minimized by ALS:

$$\min_{U, V} \sum_{u, i} C_{ui} \left(p_{ui} - u_u^\top v_i\right)^2 + \lambda \left(\sum_u \|u_u\|_2^2 + \sum_i \|v_i\|_2^2\right)$$

### Alternating Optimization Steps
1. Initialize $U$ and $V$ randomly (`random_state=42`).
2. Hold $V$ fixed; solve the exact closed-form ridge regression for every customer vector $u_u$ independently.
3. Hold $U$ fixed; solve the exact closed-form ridge regression for every product vector $v_i$ independently.
4. Repeat Steps 2–3 for `iterations` cycles until convergence.
5. Keep fitted $U$ and $V$ in RAM; score unseen candidate items via $u_u^\top v_i$ while excluding previously purchased products.

## 3. Configurable Hyperparameters
| Parameter | Default | Allowed Range | Role |
|---|---:|---|---|
| `factors` ($k$) | `32` | `8 .. 128` | Latent embedding dimensionality (model capacity) |
| `iterations` | `20` | `5 .. 50` | Number of alternating U/V optimization passes |
| `regularization` ($\lambda$) | `0.1` | `0.001 .. 10.0` | L₂ penalty preventing overfitting to sparse noise |
| `alpha` ($\alpha$) | `15.0` | `1.0 .. 100.0` | Confidence weight multiplier on observed purchases |
| `random_state` | `42` | `0 .. 99999` | Reproducible initialization seed |

Retraining executes only on explicit `POST /api/model/retrain` or `POST /api/model/configure` calls (atomically swapping the in-memory model snapshot under an `RLock`) and never runs during normal recommendation queries.

## 4. Measured Chronological Holdout Evaluation
Evaluated strictly on **`1,393` warm customers** who made unseen future purchases after `2011-11-02 12:26` (`386` cold-start test users counted and excluded):

| Metric | Implicit ALS (Default) | Popularity Baseline | Lift vs. Popularity |
|---|---:|---:|---:|
| **Precision@10** | **7.24%** (`0.07236`) | 3.44% (`0.03439`) | **2.10×** |
| **Recall@10** | **5.21%** (`0.05214`) | 2.00% (`0.01996`) | **2.61×** |
| **MAP@10** | **4.04%** (`0.04040`) | 1.41% (`0.01406`) | **2.87×** |
| **NDCG@10** | **8.70%** (`0.08697`) | 3.77% (`0.03765`) | **2.31×** |
| **Catalog Coverage@10** | **35.19%** (`1,073` SKUs) | 2.33% (`71` SKUs) | **15.11×** |
| **Avg Recommended Popularity Rank** | **#241.6** (long-tail reach) | #7.7 (bestseller head) | — |

> **Honest Scope Caveat:** Offline chronological evaluation measures alignment with held-out historical orders, not guaranteed real-world future conversion or click-through rates.

## 5. 2D Latent Space Visualization (PCA Caveat)
`GET /api/model/latent-space` computes a 2D **Principal Component Analysis (PCA)** projection of L2-normalized learned customer and product embeddings (`sklearn.decomposition.PCA(n_components=2)`). The UI explicitly displays the explained variance ratio for `PC1` and `PC2` and labels the plot strictly as a projection — axes do not possess inherent human semantic labels.

## 6. Known Limitations
1. **Cold-start:** New customers or new SKUs without training interactions cannot be scored by pure collaborative filtering and require popularity/content fallbacks.
2. **Sparsity:** `98.07%` empty entries weaken factor estimates on rare tail products.
3. **Popularity bias:** High-frequency products receive more positive confidence observations.
4. **Limited explainability:** Latent dimensions are continuous mathematical vectors rather than explicit business rules.
5. **Non-stationary preferences:** Seasonal gifting and shifting tastes mean past history does not guarantee future demand.
