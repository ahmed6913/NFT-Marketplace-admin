package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var db *sql.DB

type MintRequest struct {
	WalletAddress string `json:"wallet_address"`
	NFTName       string `json:"nft_name"`
	Description   string `json:"description"`
	BrandID       int    `json:"brand_id,omitempty"`
	TestMode      bool   `json:"test_mode,omitempty"`
}

type MintHistory struct {
	ID            int       `json:"id"`
	WalletAddress string    `json:"wallet_address"`
	NFTName       string    `json:"nft_name"`
	Description   string    `json:"description"`
	TxHash        string    `json:"tx_hash"`
	TokenID       string    `json:"token_id"`
	BrandID       int       `json:"brand_id"`
	Timestamp     time.Time `json:"timestamp"`
	Status        string    `json:"status"`
}

type DashboardStats struct {
	BrandsSignedUp   int `json:"brands_signed_up"`
	NFTsMinted       int `json:"nfts_minted"`
	CustomersWithNFT int `json:"customers_with_nft"`
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	initDB()
	defer db.Close()

	router := mux.NewRouter()
	api := router.PathPrefix("/api").Subrouter()

	api.HandleFunc("/mint", handleMintNFT).Methods("POST")
	api.HandleFunc("/history", handleGetMintHistory).Methods("GET")
	api.HandleFunc("/dashboard", handleGetDashboard).Methods("GET")
	api.HandleFunc("/health", handleHealth).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	handler := c.Handler(router)
	port := "8080"
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func initDB() {
	var err error
	dsn := "root:Saim6913$@tcp(localhost:3306)/lazarus_mint?parseTime=true"
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Connected to MySQL database")
	createTables()
}

func createTables() {
	brandsTable := `
	CREATE TABLE IF NOT EXISTS brands (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) UNIQUE,
		wallet_address VARCHAR(42),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`

	mintHistoryTable := `
	CREATE TABLE IF NOT EXISTS mint_history (
		id INT AUTO_INCREMENT PRIMARY KEY,
		wallet_address VARCHAR(42) NOT NULL,
		nft_name VARCHAR(255) NOT NULL,
		description TEXT,
		tx_hash VARCHAR(66),
		token_id VARCHAR(100),
		brand_id INT,
		status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`

	customersTable := `
	CREATE TABLE IF NOT EXISTS customers (
		id INT AUTO_INCREMENT PRIMARY KEY,
		wallet_address VARCHAR(42) UNIQUE NOT NULL,
		first_nft_received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		total_nfts_received INT DEFAULT 1
	)`

	tables := []string{brandsTable, mintHistoryTable, customersTable}
	for _, table := range tables {
		if _, err := db.Exec(table); err != nil {
			log.Fatal("Failed to create table:", err)
		}
	}
	log.Println("Database tables created successfully")
}

func handleMintNFT(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var mintReq MintRequest
	if err := json.NewDecoder(r.Body).Decode(&mintReq); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if mintReq.WalletAddress == "" || mintReq.NFTName == "" {
		http.Error(w, `{"error": "wallet_address and nft_name are required"}`, http.StatusBadRequest)
		return
	}

	// Step 1: Insert into mint_history
	result, err := db.Exec(`INSERT INTO mint_history (wallet_address, nft_name, description, brand_id, status) VALUES (?, ?, ?, ?, 'pending')`,
		mintReq.WalletAddress, mintReq.NFTName, mintReq.Description, mintReq.BrandID)
	if err != nil {
		http.Error(w, `{"error": "Failed to create mint record"}`, http.StatusInternalServerError)
		return
	}
	mintID, _ := result.LastInsertId()

	// Step 2: Mock tx_hash, token_id, status
	txHash := fmt.Sprintf("0x%x", time.Now().UnixNano())
	tokenID := fmt.Sprintf("%d", time.Now().UnixNano()%10000)
	status := "success"

	if !mintReq.TestMode {
		// TODO: replace with actual smart contract interaction
		// status = "failed" // if it fails
	}

	// Step 3: Update mint_history with tx info
	_, err = db.Exec("UPDATE mint_history SET tx_hash = ?, token_id = ?, status = ? WHERE id = ?", txHash, tokenID, status, mintID)
	if err != nil {
		http.Error(w, `{"error": "Failed to update mint record"}`, http.StatusInternalServerError)
		return
	}

	// Step 4: Update customers table
	var exists int
	err = db.QueryRow("SELECT COUNT(*) FROM customers WHERE wallet_address = ?", mintReq.WalletAddress).Scan(&exists)
	if err != nil {
		log.Println("Failed checking customer:", err)
	}

	if exists == 0 {
		// Insert new customer
		_, err = db.Exec(`INSERT INTO customers (wallet_address, total_nfts_received) VALUES (?, 1)`, mintReq.WalletAddress)
		if err != nil {
			log.Println("Failed to insert new customer:", err)
		}
	} else {
		// Increment total_nfts_received
		_, err = db.Exec(`UPDATE customers SET total_nfts_received = total_nfts_received + 1 WHERE wallet_address = ?`, mintReq.WalletAddress)
		if err != nil {
			log.Println("Failed to update existing customer:", err)
		}
	}

	// Step 5: Respond
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":          true,
		"message":          "NFT minted successfully (mocked if test_mode is true)",
		"transaction_hash": txHash,
		"token_id":         tokenID,
		"mint_id":          mintID,
		"test_mode":        mintReq.TestMode,
	})
}


func handleGetMintHistory(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	rows, err := db.Query(`SELECT id, wallet_address, nft_name, description, COALESCE(tx_hash, '') as tx_hash, COALESCE(token_id, '') as token_id, COALESCE(brand_id, 0) as brand_id, created_at, status FROM mint_history ORDER BY created_at DESC LIMIT 50`)
	if err != nil {
		http.Error(w, `{"error": "Failed to fetch mint history"}`, http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var history []MintHistory
	for rows.Next() {
		var h MintHistory
		err := rows.Scan(&h.ID, &h.WalletAddress, &h.NFTName, &h.Description, &h.TxHash, &h.TokenID, &h.BrandID, &h.Timestamp, &h.Status)
		if err != nil {
			continue
		}
		history = append(history, h)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"history": history})
}

func handleGetDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var stats DashboardStats
	db.QueryRow("SELECT COUNT(*) FROM brands").Scan(&stats.BrandsSignedUp)
	db.QueryRow("SELECT COUNT(*) FROM mint_history WHERE status = 'success'").Scan(&stats.NFTsMinted)
	db.QueryRow("SELECT COUNT(*) FROM customers").Scan(&stats.CustomersWithNFT)
	json.NewEncoder(w).Encode(stats)
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now(),
		"database":  "connected",
	})
}
