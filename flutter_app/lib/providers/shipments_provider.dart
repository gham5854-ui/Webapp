import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ShipmentsProvider with ChangeNotifier {
  List<dynamic> _shipments = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<dynamic> get shipments => _shipments;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchShipments() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiService.get('/shipments');
      if (response.statusCode == 200) {
        _shipments = jsonDecode(response.body);
      } else {
        _errorMessage = 'Failed to load shipments';
      }
    } catch (e) {
      _errorMessage = 'Could not connect to server';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>?> trackShipment(String pin) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiService.get('/shipments/track/$pin');
      _isLoading = false;
      notifyListeners();
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final data = jsonDecode(response.body);
        _errorMessage = data['error'] ?? 'No shipment found with this tracking PIN';
      }
    } catch (e) {
      _errorMessage = 'Could not connect to server';
      _isLoading = false;
      notifyListeners();
    }
    return null;
  }

  Future<Map<String, dynamic>?> addShipment({
    required String recipient,
    required String origin,
    required String destination,
    required String courier,
    required String eta,
    required double value,
    required bool insured,
    required String item,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await ApiService.post('/shipments', {
        'recipient': recipient,
        'origin': origin,
        'destination': destination,
        'courier': courier,
        'eta': eta,
        'value': value,
        'insured': insured,
        'item': item,
      });

      if (response.statusCode == 201) {
        final newShipment = jsonDecode(response.body);
        _shipments.insert(0, newShipment);
        _isLoading = false;
        notifyListeners();
        return newShipment;
      } else {
        final data = jsonDecode(response.body);
        _errorMessage = data['error'] ?? 'Failed to add shipment';
      }
    } catch (e) {
      _errorMessage = 'Could not connect to server';
    }

    _isLoading = false;
    notifyListeners();
    return null;
  }

  Future<bool> updateStatus(String id, String status) async {
    try {
      final response = await ApiService.patch('/shipments/$id', {
        'status': status,
      });
      if (response.statusCode == 200) {
        final updatedShipment = jsonDecode(response.body);
        final index = _shipments.indexWhere((s) => s['id'] == id);
        if (index != -1) {
          _shipments[index] = updatedShipment;
          notifyListeners();
        }
        return true;
      }
    } catch (e) {
      debugPrint('Failed to update status: $e');
    }
    return false;
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
