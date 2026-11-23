# Presentation Script — KERNEL / ORBIT (30 Slides)

**Title:** KERNEL / ORBIT — Inside the Recommendation Model
**Topic:** Personalized Product Recommendation via Implicit Matrix Factorization (ALS)
**Dataset:** Official UCI Online Retail (541,909 UK gift transactions)
**Estimated Runtime:** 12–15 minutes including live interactive laboratory demonstration.

---

## Chapter 01 — The Awakening (Slides 01–05)
- **Slide 01 — Machines Can Learn:** Open on the title screen. Introduce KERNEL / ORBIT: looking inside a real recommendation model trained on 541,909 gift store transactions.
- **Slide 02 — The Central Question:** Contrast brittle hand-written merchandising rules (`if bought_mug && month == 12`) against learning patterns directly from shopping behavior.
- **Slide 03 — Artificial Intelligence:** Position AI as the broad umbrella spanning symbolic logic, planning, knowledge systems, and learning.
- **Slide 04 — Machine Learning:** Zoom into the concentric AI ⊃ ML ⊃ Deep Learning taxonomy and highlight Classical / Matrix Factorization Collaborative Filtering.
- **Slide 05 — Traditional Programming vs. ML:** Show the core inversion: traditional code combines rules + data for answers; ML combines customer-item history to produce a reusable model.

## Chapter 02 — Understanding the Model (Slides 06–10)
- **Slide 06 — What Is a Recommendation Model?:** Demystify the model as a scoring function $f(u, i) = u_u \cdot v_i \to \hat{r}$ that ranks unseen gift products.
- **Slide 07 — Algorithm vs. Model:** Clarify the difference: ALS is the optimization recipe; the fitted matrices $U$ (`3,751 × 32`) and $V$ (`3,049 × 32`) are the trained model artifact.
- **Slide 08 — UCI Online Retail Dataset:** Walk through real transaction rows (`CustomerID`, `StockCode`, `Description`, `Quantity`, `InvoiceDate`) from UCI ID 352.
- **Slide 09 — Learning Paradigms:** Contrast Supervised, Latent/Matrix Factorization, and Reinforcement Learning.
- **Slide 10 — Explicit vs. Implicit Feedback:** Explain why retail logs have no star ratings — purchases give positive confidence $C_{ui} = 1 + \alpha r_{ui}$, while unobserved cells remain low-confidence unknowns, not dislikes.

## Chapter 03 — How Learning Happens (Slides 11–15)
- **Slide 11 — The Recommendation Lifecycle:** Trace the 6 stages from raw invoice ingestion to live Top-N serving.
- **Slide 12 — Cleaning & Confidence Scaling:** Highlight real-world messiness (`9,288` cancelled invoices, `135,080` missing customer IDs, service fees like `POST`, and an `80,995`-unit wholesale spike) and why $r_{ui} = \ln(1 + \text{invoices})$ tames outliers.
- **Slide 13 — Chronological 80 / 20 Split:** Emphasize temporal discipline — train on Dec 2010–Nov 2011 (`317,063` rows), test on the final 20% future window (`79,274` rows), zero future leakage, explicit cold-start accounting (`386` cold users vs. `1,393` warm evaluated users).
- **Slide 14 — Generalization & Regularization:** Explain how L₂ regularization ($\lambda$) stops latent factors from memorizing isolated noise.
- **Slide 15 — Sparse Matrix to Dense Factors:** Show how a `98.07%` empty matrix compresses ~52× into dense embeddings held in RAM for sub-millisecond inference.

## Chapter 04 — Meet Matrix Factorization (Slides 16–21)
- **Slide 16 — Meet Collaborative Filtering:** Clarify that matrix factorization goes far beyond naive "same-item overlap" — it captures global latent structure across the whole catalog.
- **Slide 17 — Customer–Product Matrix R:** Inspect observed cells vs. `?` prediction targets across `3,751 × 3,049`.
- **Slide 18 — Mathematics of Matrix Factorization:** Present $R \approx U \times V^\top$ and the Hu–Koren–Volinsky weighted regularized objective.
- **Slide 19 — Discovering Latent Factors:** Show how aligned customer vector $u_u$ and product vector $v_i$ create strong positive dot products without hand-labeled feature tags.
- **Slide 20 — How Alternating Least Squares Works:** Step through the 5-step alternating solve (Fix $V \to$ solve $U$; Fix $U \to$ solve $V$; repeat until convergence).
- **Slide 21 — From Factors to Recommendations:** Show dot-product scoring, masking already-purchased products, and ranking Top-N discoveries.

## Chapter 05 — The ORBIT Laboratory (Slide 22 — Live Demo, ~4 min)
1. **Tab 1 (Customer & Recs):** Select `CUST-14911` (or click **Random**). Point to the real training purchase history, the 16-factor embedding sparkline `u_u`, and the live Top-10 ALS recommendations — note how previously purchased items are excluded and point out **`BOUGHT IN TEST`** badges proving ALS predicted real unseen future purchases!
2. **Tab 2 (Product Explorer):** Click any recommended product (or search `"CANDLE"` / `"HEART"`). Show its learned embedding `v_i` and nearest products via ALS `similar_items`.
3. **Tab 3 (Matrix & 2D PCA):** Show the real `12 × 16` sparse interaction heatmap on the left and the 2D PCA projection on the right, highlighting the active customer connected to its Top-5 recommendations (explicitly noting PCA is a 2D variance projection without semantic axis labels).
4. **Tab 4 (Configure & Retrain):** Adjust `Latent Factors (k)` from `32` to `16` (or `64`), click **Apply & Retrain Model**, show the real live training time (~0.3s), and demonstrate how holdout metrics update live before clicking Reset back to `k=32`.

## Chapter 06 — Evaluation (Slides 23–27)
- **Slide 23 — Evaluating Recommendations:** Explain why classification accuracy fails on 98% sparse matrices and introduce the chronological Popularity Baseline comparison.
- **Slide 24 — Precision, Recall, MAP & NDCG:** Review exact formulas alongside live backend numbers (`Precision@10` 2.1× lift, `NDCG@10` 2.3× lift over popularity).
- **Slide 25 — Catalog Coverage & Popularity Bias:** Highlight the **15× catalog coverage lift** (`35.2%` vs. `2.3%` — `1,073` unique products surfaced vs. `71` bestsellers).
- **Slide 26 — ALS vs. Popularity Holdout:** Compare live K=5 and K=10 bars and clearly state the honest caveat: offline historical holdout ≠ guaranteed future live clicks.
- **Slide 27 — Collaborative Filtering Limitations:** Walk honestly through Cold-Start, Sparsity, Popularity Bias, Latent Explainability, and Shifting Human Preferences.

## Chapter 07 — Beyond the Algorithm (Slides 28–30)
- **Slide 28 — Real-World Applications:** Connect ORBIT's math to E-Commerce cross-selling, Music discovery, Video streaming, and Retail personalization.
- **Slide 29 — What We Learned:** Synthesize the 5 core engineering takeaways.
- **Slide 30 — Closing Statement:** End on *"The model doesn't think like us. It learns latent patterns from collective behavior. We decide how to recommend responsibly."*
