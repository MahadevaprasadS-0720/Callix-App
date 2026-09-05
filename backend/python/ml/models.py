import json
from pathlib import Path
from typing import Dict, Any, Tuple
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
import joblib

# ----------------------------------------------------------------------
# 1. Random Forest Classifier
# ----------------------------------------------------------------------
class RandomForestFraudModel:
    def __init__(self, n_estimators: int = 100, max_depth: int = 10, random_state: int = 42):
        self.name = "Random Forest Classifier"
        self.model = RandomForestClassifier(
            n_estimators=n_estimators, 
            max_depth=max_depth, 
            random_state=random_state,
            class_weight="balanced"
        )
        self.is_trained = False

    def train(self, X: np.ndarray, y: np.ndarray):
        X = np.atleast_2d(X)
        self.model.fit(X, y)
        self.is_trained = True

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.atleast_2d(X)
        if not self.is_trained:
            return np.clip(np.mean(X[:, [0, 1, 2, 3, 4, 13]], axis=1) * 1.5, 0.05, 0.98)
        probs = self.model.predict_proba(X)
        return probs[:, 1] if probs.shape[1] > 1 else probs[:, 0]

    def save(self, filepath: Path):
        joblib.dump(self.model, filepath)

    def load(self, filepath: Path):
        if filepath.exists():
            self.model = joblib.load(filepath)
            self.is_trained = True

# ----------------------------------------------------------------------
# 2. Support Vector Machine (SVM)
# ----------------------------------------------------------------------
class SVMFraudModel:
    def __init__(self, kernel: str = "rbf", C: float = 1.0, random_state: int = 42):
        self.name = "Support Vector Machine (SVM)"
        self.model = SVC(kernel=kernel, C=C, probability=True, random_state=random_state)
        self.is_trained = False

    def train(self, X: np.ndarray, y: np.ndarray):
        X = np.atleast_2d(X)
        self.model.fit(X, y)
        self.is_trained = True

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.atleast_2d(X)
        if not self.is_trained:
            return np.clip(np.mean(X[:, [0, 2, 3, 5, 14, 15]], axis=1) * 1.4, 0.05, 0.98)
        probs = self.model.predict_proba(X)
        return probs[:, 1] if probs.shape[1] > 1 else probs[:, 0]

    def save(self, filepath: Path):
        joblib.dump(self.model, filepath)

    def load(self, filepath: Path):
        if filepath.exists():
            self.model = joblib.load(filepath)
            self.is_trained = True

# ----------------------------------------------------------------------
# 3. 1D Convolutional Neural Network (CNN)
# ----------------------------------------------------------------------
class CNN1DFraudModel:
    def __init__(self, input_dim: int = 16, num_filters: int = 8, kernel_size: int = 3):
        self.name = "1D Convolutional Neural Network (CNN)"
        self.input_dim = input_dim
        self.num_filters = num_filters
        self.kernel_size = kernel_size
        
        rng = np.random.RandomState(42)
        self.W_conv = rng.randn(num_filters, kernel_size).astype(np.float32) * 0.3
        self.b_conv = np.zeros((num_filters,), dtype=np.float32)
        
        conv_out_len = (input_dim - kernel_size + 1)
        pooled_len = (conv_out_len + 1) // 2
        dense_in_dim = num_filters * pooled_len
        
        self.W_dense = rng.randn(dense_in_dim, 1).astype(np.float32) * 0.3
        self.b_dense = np.zeros((1,), dtype=np.float32)
        self.is_trained = False

    def _sigmoid(self, z):
        return 1.0 / (1.0 + np.exp(-np.clip(z, -15.0, 15.0)))

    def _forward_pass(self, x: np.ndarray):
        conv_out_len = self.input_dim - self.kernel_size + 1
        conv_maps = np.zeros((self.num_filters, conv_out_len), dtype=np.float32)
        
        for f in range(self.num_filters):
            for i in range(conv_out_len):
                conv_maps[f, i] = np.sum(x[i : i + self.kernel_size] * self.W_conv[f]) + self.b_conv[f]
        
        relu_out = np.maximum(0.0, conv_maps)
        
        pooled_len = (conv_out_len + 1) // 2
        pooled = np.zeros((self.num_filters, pooled_len), dtype=np.float32)
        max_indices = np.zeros((self.num_filters, pooled_len), dtype=np.int32)
        
        for f in range(self.num_filters):
            for p in range(pooled_len):
                idx = p * 2
                chunk = relu_out[f, idx : min(idx + 2, conv_out_len)]
                max_pos = np.argmax(chunk)
                pooled[f, p] = chunk[max_pos]
                max_indices[f, p] = idx + max_pos

        flattened = pooled.flatten()
        logit = np.dot(flattened, self.W_dense.flatten()) + self.b_dense[0]
        prob = float(self._sigmoid(logit))
        
        cache = (x, conv_maps, relu_out, pooled, max_indices, flattened, prob)
        return prob, cache

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.atleast_2d(X)
        probs = [self._forward_pass(row)[0] for row in X]
        return np.array(probs, dtype=np.float32)

    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 30, lr: float = 0.05):
        X = np.atleast_2d(X)
        for _ in range(epochs):
            for i in range(len(X)):
                prob, cache = self._forward_pass(X[i])
                target = float(y[i])
                d_logit = (prob - target) # cross-entropy loss derivative w.r.t logit
                
                x, conv_maps, relu_out, pooled, max_indices, flattened, _ = cache
                
                # Dense gradients
                dW_dense = (d_logit * flattened).reshape(self.W_dense.shape)
                db_dense = d_logit
                
                # Backprop into pooled features
                d_pooled = (d_logit * self.W_dense.flatten()).reshape(pooled.shape)
                
                # Backprop through max pool & ReLU into conv_maps
                d_conv = np.zeros_like(conv_maps)
                conv_out_len = conv_maps.shape[1]
                pooled_len = pooled.shape[1]
                for f in range(self.num_filters):
                    for p in range(pooled_len):
                        best_idx = max_indices[f, p]
                        if relu_out[f, best_idx] > 0:
                            d_conv[f, best_idx] += d_pooled[f, p]
                
                # Conv weight gradients
                dW_conv = np.zeros_like(self.W_conv)
                db_conv = np.zeros_like(self.b_conv)
                for f in range(self.num_filters):
                    db_conv[f] = np.sum(d_conv[f])
                    for k in range(self.kernel_size):
                        dW_conv[f, k] = np.sum(d_conv[f] * x[k : k + conv_out_len])
                
                # Gradient descent step
                self.W_dense -= lr * dW_dense
                self.b_dense -= lr * db_dense
                self.W_conv -= lr * dW_conv
                self.b_conv -= lr * db_conv

        self.is_trained = True

    def save(self, filepath: Path):
        data = {
            "W_conv": self.W_conv.tolist(),
            "b_conv": self.b_conv.tolist(),
            "W_dense": self.W_dense.tolist(),
            "b_dense": self.b_dense.tolist(),
            "is_trained": self.is_trained
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f)

    def load(self, filepath: Path):
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.W_conv = np.array(data["W_conv"], dtype=np.float32)
                self.b_conv = np.array(data["b_conv"], dtype=np.float32)
                self.W_dense = np.array(data["W_dense"], dtype=np.float32)
                self.b_dense = np.array(data["b_dense"], dtype=np.float32)
                self.is_trained = data.get("is_trained", True)

# ----------------------------------------------------------------------
# 4. Recurrent Neural Network (RNN)
# ----------------------------------------------------------------------
class RNNFraudModel:
    def __init__(self, input_dim: int = 16, hidden_dim: int = 16):
        self.name = "Recurrent Neural Network (RNN)"
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        
        rng = np.random.RandomState(43)
        self.W_xh = rng.randn(hidden_dim, 4).astype(np.float32) * 0.2
        self.W_hh = rng.randn(hidden_dim, hidden_dim).astype(np.float32) * 0.2
        self.b_h = np.zeros((hidden_dim,), dtype=np.float32)
        
        self.W_hy = rng.randn(hidden_dim, 1).astype(np.float32) * 0.2
        self.b_y = np.zeros((1,), dtype=np.float32)
        self.is_trained = False

    def _sigmoid(self, z):
        return 1.0 / (1.0 + np.exp(-np.clip(z, -15.0, 15.0)))

    def _forward_pass(self, x: np.ndarray):
        timesteps = 4
        feats_per_step = 4
        seq = x.reshape(timesteps, feats_per_step)
        
        h_states = [np.zeros((self.hidden_dim,), dtype=np.float32)]
        for t in range(timesteps):
            xt = seq[t]
            h_prev = h_states[-1]
            h_next = np.tanh(np.dot(self.W_xh, xt) + np.dot(self.W_hh, h_prev) + self.b_h)
            h_states.append(h_next)
            
        h_last = h_states[-1]
        logit = np.dot(h_last, self.W_hy.flatten()) + self.b_y[0]
        prob = float(self._sigmoid(logit))
        return prob, seq, h_states

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.atleast_2d(X)
        probs = [self._forward_pass(row)[0] for row in X]
        return np.array(probs, dtype=np.float32)

    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 30, lr: float = 0.03):
        X = np.atleast_2d(X)
        timesteps = 4
        for _ in range(epochs):
            for i in range(len(X)):
                prob, seq, h_states = self._forward_pass(X[i])
                target = float(y[i])
                d_logit = prob - target
                
                h_last = h_states[-1]
                dW_hy = (d_logit * h_last).reshape(self.W_hy.shape)
                db_y = d_logit
                
                # Backprop through time (BPTT)
                dh = (d_logit * self.W_hy.flatten())
                dW_xh = np.zeros_like(self.W_xh)
                dW_hh = np.zeros_like(self.W_hh)
                db_h = np.zeros_like(self.b_h)
                
                for t in reversed(range(timesteps)):
                    dtanh = dh * (1.0 - h_states[t + 1] ** 2)
                    dW_xh += np.outer(dtanh, seq[t])
                    dW_hh += np.outer(dtanh, h_states[t])
                    db_h += dtanh
                    dh = np.dot(self.W_hh.T, dtanh)
                    
                self.W_hy -= lr * dW_hy
                self.b_y -= lr * db_y
                self.W_xh -= lr * dW_xh
                self.W_hh -= lr * dW_hh
                self.b_h -= lr * db_h

        self.is_trained = True

    def save(self, filepath: Path):
        data = {
            "W_xh": self.W_xh.tolist(),
            "W_hh": self.W_hh.tolist(),
            "b_h": self.b_h.tolist(),
            "W_hy": self.W_hy.tolist(),
            "b_y": self.b_y.tolist(),
            "is_trained": self.is_trained
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f)

    def load(self, filepath: Path):
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.W_xh = np.array(data["W_xh"], dtype=np.float32)
                self.W_hh = np.array(data["W_hh"], dtype=np.float32)
                self.b_h = np.array(data["b_h"], dtype=np.float32)
                self.W_hy = np.array(data["W_hy"], dtype=np.float32)
                self.b_y = np.array(data["b_y"], dtype=np.float32)
                self.is_trained = data.get("is_trained", True)

# ----------------------------------------------------------------------
# 5. Long Short-Term Memory (LSTM)
# ----------------------------------------------------------------------
class LSTMFraudModel:
    def __init__(self, input_dim: int = 16, hidden_dim: int = 16):
        self.name = "Long Short-Term Memory (LSTM)"
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        
        rng = np.random.RandomState(44)
        gate_in_dim = 4 + hidden_dim
        self.W_gates = rng.randn(4 * hidden_dim, gate_in_dim).astype(np.float32) * 0.2
        self.b_gates = np.zeros((4 * hidden_dim,), dtype=np.float32)
        # Initialize forget gate bias to 1.0 for better gradient retention
        self.b_gates[0 : hidden_dim] = 1.0
        
        self.W_out = rng.randn(hidden_dim, 1).astype(np.float32) * 0.2
        self.b_out = np.zeros((1,), dtype=np.float32)
        self.is_trained = False

    def _sigmoid(self, z):
        return 1.0 / (1.0 + np.exp(-np.clip(z, -15.0, 15.0)))

    def _forward_pass(self, x: np.ndarray):
        timesteps = 4
        feats_per_step = 4
        seq = x.reshape(timesteps, feats_per_step)
        
        H = self.hidden_dim
        h_states = [np.zeros((H,), dtype=np.float32)]
        c_states = [np.zeros((H,), dtype=np.float32)]
        gates_list = []
        
        for t in range(timesteps):
            xt = seq[t]
            h_prev = h_states[-1]
            concat = np.concatenate([xt, h_prev])
            raw_gates = np.dot(self.W_gates, concat) + self.b_gates
            
            f_t = self._sigmoid(raw_gates[0 : H])
            i_t = self._sigmoid(raw_gates[H : 2*H])
            c_cand = np.tanh(raw_gates[2*H : 3*H])
            o_t = self._sigmoid(raw_gates[3*H : 4*H])
            
            c_next = f_t * c_states[-1] + i_t * c_cand
            h_next = o_t * np.tanh(c_next)
            
            gates_list.append((f_t, i_t, c_cand, o_t, concat))
            c_states.append(c_next)
            h_states.append(h_next)
            
        h_last = h_states[-1]
        logit = np.dot(h_last, self.W_out.flatten()) + self.b_out[0]
        prob = float(self._sigmoid(logit))
        return prob, seq, h_states, c_states, gates_list

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.atleast_2d(X)
        probs = [self._forward_pass(row)[0] for row in X]
        return np.array(probs, dtype=np.float32)

    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 30, lr: float = 0.03):
        X = np.atleast_2d(X)
        timesteps = 4
        H = self.hidden_dim
        
        for _ in range(epochs):
            for i in range(len(X)):
                prob, seq, h_states, c_states, gates_list = self._forward_pass(X[i])
                target = float(y[i])
                d_logit = prob - target
                
                h_last = h_states[-1]
                dW_out = (d_logit * h_last).reshape(self.W_out.shape)
                db_out = d_logit
                
                # Backprop into LSTM
                dh_next = d_logit * self.W_out.flatten()
                dc_next = np.zeros((H,), dtype=np.float32)
                
                dW_gates = np.zeros_like(self.W_gates)
                db_gates = np.zeros_like(self.b_gates)
                
                for t in reversed(range(timesteps)):
                    f_t, i_t, c_cand, o_t, concat = gates_list[t]
                    c_prev = c_states[t]
                    c_curr = c_states[t + 1]
                    
                    tanh_c = np.tanh(c_curr)
                    do = dh_next * tanh_c * (o_t * (1.0 - o_t))
                    dc = dc_next + dh_next * o_t * (1.0 - tanh_c ** 2)
                    
                    df = dc * c_prev * (f_t * (1.0 - f_t))
                    di = dc * c_cand * (i_t * (1.0 - i_t))
                    dc_cand = dc * i_t * (1.0 - c_cand ** 2)
                    
                    d_raw = np.concatenate([df, di, dc_cand, do])
                    dW_gates += np.outer(d_raw, concat)
                    db_gates += d_raw
                    
                    dc_next = dc * f_t
                    dh_next = np.dot(self.W_gates[:, 4:].T, d_raw)
                    
                self.W_out -= lr * dW_out
                self.b_out -= lr * db_out
                self.W_gates -= lr * dW_gates
                self.b_gates -= lr * db_gates

        self.is_trained = True

    def save(self, filepath: Path):
        data = {
            "W_gates": self.W_gates.tolist(),
            "b_gates": self.b_gates.tolist(),
            "W_out": self.W_out.tolist(),
            "b_out": self.b_out.tolist(),
            "is_trained": self.is_trained
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f)

    def load(self, filepath: Path):
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.W_gates = np.array(data["W_gates"], dtype=np.float32)
                self.b_gates = np.array(data["b_gates"], dtype=np.float32)
                self.W_out = np.array(data["W_out"], dtype=np.float32)
                self.b_out = np.array(data["b_out"], dtype=np.float32)
                self.is_trained = data.get("is_trained", True)
